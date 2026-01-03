import { supabase } from "@/utils/supabase";
import moment from "moment-jalaali";

export async function fetchReading() {
  const { data, error } = await supabase
    .from("reading")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw Error("خطا در بارگذاری");
  }

  return data ?? [];
}

export async function fetchReadingLog(userId: string, period: string) {
  const now = moment();

  let fromDate: moment.Moment;

  switch (period) {
    case "daily":
      fromDate = now.clone().subtract(6, "days");
      break;
    case "weekly":
      fromDate = now.clone().subtract(5, "weeks").startOf("week");
      break;
    case "monthly":
    default:
      fromDate = now.clone().subtract(5, "months").startOf("month");
      break;
  }

  const { data, error } = await supabase
    .from("reading_logs")
    .select("pages_read, created_at")
    .eq("user_id", userId)
    .gte("created_at", fromDate.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw Error("خطا در بارگذاری اطلاعات مطالعاتی");

  const grouped: Record<string, number> = {};

  data?.forEach((item) => {
    let key: string;

    if (period === "daily") {
      key = moment(item.created_at).format("jYYYY/jMM/jDD");
    } else if (period === "weekly") {
      const start = moment(item.created_at).startOf("week");
      key = `${start.format("jYYYY/jMM/jDD")}`;
    } else {
      key = moment(item.created_at).format("jYYYY/jMM/jDD");
    }

    grouped[key] = (grouped[key] || 0) + item.pages_read;
  });

  return Object.entries(grouped).map(([label, value]) => ({
    label,
    value,
  }));
}
