import { TargetsProps } from "@/type";
import { getDateRange } from "@/utils/getDateRange";
import { supabase } from "@/utils/supabase";

export async function fetchTargets() {
  const { data, error } = await supabase
    .from("reading_goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw Error("خطا در بارگذاری");
  }

  return data ?? [];
}

export async function fetchGoalProgress(goal: TargetsProps) {
  const range = getDateRange(goal.period);

  const from = range?.from.toISOString();
  const to = range?.to.toISOString();

  if (!range) {
    return { progress: 0, percentage: 0 };
  }

  if (goal.type === "pages") {
    const { data, error } = await supabase
      .from("reading_logs")
      .select("pages_read")
      .eq("user_id", goal.user_id)
      .gte("created_at", from)
      .lte("created_at", to);

    if (error) throw error;

    const totalPages =
      data?.reduce((sum, item) => sum + item.pages_read, 0) ?? 0;

    return {
      progress: totalPages,
      percentage:
        goal.target_value > 0
          ? Math.min(Math.round((totalPages / goal.target_value) * 100), 100)
          : 0,
    };
  }

  const { data, error } = await supabase
    .from("reading_logs")
    .select("book_id")
    .eq("user_id", goal.user_id)
    .gte("created_at", from)
    .lte("created_at", to);

  if (error) throw error;

  const uniqueBooks = new Set(data?.map((i) => i.book_id)).size;

  return {
    progress: uniqueBooks,
    percentage:
      goal.target_value > 0
        ? Math.min(Math.round((uniqueBooks / goal.target_value) * 100), 100)
        : 0,
  };
}
