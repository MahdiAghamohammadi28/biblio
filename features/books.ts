import { supabase } from "@/utils/supabase";

export async function fetchBooks() {
  const { data, error } = await supabase
    .from("books")
    .select(
      `
      id,
      user_id,
      title,
      author,
      translator,
      publisher,
      total_pages,
      read_pages,
      status,
      description,
      genre,
      started_date,
      loan (
        id,
        is_returned
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw Error(error.message);
  }

  return (
    data?.map((book) => ({
      ...book,
      isLoaned: book.loan?.some((l: any) => l.is_returned === false),
    })) ?? []
  );
}

export async function fetchUnreadBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("status", "unread");

  if (error) {
    throw Error(error.message);
  }

  return data ?? [];
}

export async function fetchBookStatics(user_id: string) {
  const { data: allBooks, error: allBooksError } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", user_id);

  if (allBooksError) throw Error("خطا در بارگذاری کتاب ها");

  const { data: completedBooks, error: completedBooksError } = await supabase
    .from("books")
    .select("*")
    .eq("status", "completed")
    .eq("user_id", user_id);

  if (completedBooksError) throw Error("خطا در بارگذاری کتاب های خوانده شده");

  const { data: unreadBooks, error: unreadBooksError } = await supabase
    .from("books")
    .select("*")
    .eq("status", "unread")
    .eq("user_id", user_id);

  if (unreadBooksError) throw Error("خطا در بارگذاری کتاب های خوانده نشده");

  return {
    totalBooks: allBooks.length ?? 0,
    completedBooks: completedBooks.length ?? 0,
    unreadBooks: unreadBooks.length ?? 0,
  };
}
