import { supabase } from "@/utils/supabase";

export async function fetchNotes(noteId: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("book_id", noteId)
    .order("created_at", { ascending: false });

  if (error) {
    throw Error("خطا در بارگذاری یادداشت ها");
  }

  return data ?? [];
}
