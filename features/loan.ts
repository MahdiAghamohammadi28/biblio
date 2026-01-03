import { supabase } from "@/utils/supabase";

export async function fetchLoanedBooks() {
  const { data, error } = await supabase
    .from("loan")
    .select(
      `
      id,
      borrower_name,
      borrowed_at,
      is_returned,
      note,
      books (
        id,
        title
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw Error(error.message);
  }

  return data ?? [];
}
