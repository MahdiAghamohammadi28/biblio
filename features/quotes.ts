import { supabase } from "@/utils/supabase";

export async function fetchQuotesById(bookId: string) {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });

  if (error) {
    throw Error("خطا در بارگذاری نقل و قول ها");
  }

  return data ?? [];
}

export async function fetchQuotes() {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("خطا در بارگذاری نقل‌قول‌ها");
  }

  return data ?? [];
}
