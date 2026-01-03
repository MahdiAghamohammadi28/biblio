import BookModal from "@/components/books-screen/BookModal";
import RenderBookItem from "@/components/books-screen/RenderBookItem";
import MainHeader from "@/components/header/MainHeader";
import LoanModal from "@/components/loan-screen/LoanModal";
import EmptyState from "@/components/ui/EmptyState";
import DeleteModal from "@/components/utils/DeleteModal";
import { COLORS } from "@/constants/colors";
import { fetchBooks } from "@/features/books";
import { BookProps } from "@/type";
import { supabase } from "@/utils/supabase";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function Books() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<BookProps[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [bookModal, setBookModal] = useState<boolean>(false);
  const [loanModal, setLoanModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<BookProps | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const loadBooks = useCallback(async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (error) {
      console.log("FETCHING_BOOKS_ERROR:", error);
    }
  }, []);

  useEffect(() => {
    async function loadBook() {
      try {
        setIsLoading(true);
        await loadBooks();
      } finally {
        setIsLoading(false);
      }
    }
    loadBook();

    const booksChannel = supabase
      .channel("books_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "books",
        },
        async (payload) => {
          console.log("Real-time update received:", payload);
          await loadBooks();
        }
      )
      .subscribe();

    const loanChannel = supabase
      .channel("loan_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "loan",
        },
        async (payload) => {
          console.log("Real-time update received:", payload);
          await loadBooks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(booksChannel);
      supabase.removeChannel(loanChannel);
    };
  }, [loadBooks]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadBooks();
    setIsRefreshing(false);
  }, [loadBooks]);

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  async function handleDeleteBook() {
    if (!selectedBook) return;

    try {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", selectedBook.id);

      const { error: loanError } = await supabase
        .from("loan")
        .delete()
        .eq("book_id", selectedBook.id);
      const { error: readingError } = await supabase
        .from("reading")
        .delete()
        .eq("book_id", selectedBook.id);

      if (error || loanError || readingError) {
        console.log("DELETE_BOOK_ERROR:", error);
        return;
      }

      setConfirmDelete(false);
      setSelectedBook(null);
    } catch (err) {
      console.log("DELETE_BOOK_CATCH_ERROR:", err);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <MainHeader
          title={"لیست کتاب ها"}
          drawer
          plus
          onPressPlusBtn={() => {
            setSelectedBook(null);
            setIsEditing(false);
            setBookModal(true);
          }}
        />
        <View style={styles.searchBox}>
          <TextInput
            inputMode="text"
            placeholder="جستجو بر اساس نام کتاب و نویسنده"
            placeholderTextColor={"#888"}
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={scale(80)} color={COLORS.light.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredBooks}
            contentContainerStyle={[
              styles.content,
              { flex: books.length === 0 ? 1 : undefined },
            ]}
            renderItem={({ item }) => (
              <RenderBookItem
                item={item}
                onEdit={() => {
                  setSelectedBook(item);
                  setIsEditing(true);
                  setBookModal(true);
                }}
                onLoan={() => {
                  setLoanModal(true);
                  setSelectedBook(item);
                }}
                onDelete={() => {
                  setConfirmDelete(true);
                  setSelectedBook(item);
                }}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <EmptyState label="هنوز هیچ کتابی اضافه نکردی" />
            }
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <BookModal
        visible={bookModal}
        onRequestClose={() => {
          setBookModal(false);
          setIsEditing(false);
        }}
        title={isEditing === true ? "ویرایش کتاب" : "افزودن کتاب"}
        btnLabel={isEditing === true ? "ویرایش" : "افزودن"}
        defaultValues={selectedBook}
        onClose={() => {
          setBookModal(false);
          setIsEditing(false);
          setSelectedBook(null);
        }}
      />
      <LoanModal
        visible={loanModal}
        onCancel={() => setLoanModal(false)}
        bookId={selectedBook?.id ?? ""}
        btnLabel="افزودن به امانت"
      />
      <DeleteModal
        visible={confirmDelete}
        onRequestClose={() => setConfirmDelete(false)}
        title={`حذف کتاب ${selectedBook?.title}`}
        message={"مطمئنی میخوای حذفش کنی؟"}
        btnLabel="حذف کتاب"
        onCancel={() => {
          setConfirmDelete(false);
          setSelectedBook(null);
        }}
        onDelete={handleDeleteBook}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.bg,
    direction: "rtl",
  },
  searchBox: {
    padding: moderateScale(12),
  },
  input: {
    height: verticalScale(40),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    padding: moderateScale(6),
    borderRadius: 14,
    fontFamily: "IranYekan-Regular",
  },
  content: {
    paddingHorizontal: moderateScale(12),
    paddingBottom: verticalScale(18),
    gap: 8,
  },
});
