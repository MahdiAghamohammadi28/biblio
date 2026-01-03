import MainHeader from "@/components/header/MainHeader";
import QuoteModal from "@/components/quote-screen/QuoteModal";
import RenderQuoteItem from "@/components/quote-screen/RenderQuoteItem";
import EmptyState from "@/components/ui/EmptyState";
import DeleteModal from "@/components/utils/DeleteModal";
import { COLORS } from "@/constants/colors";
import { fetchQuotesById } from "@/features/quotes";
import { QuotesProps } from "@/type";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function Quotes() {
  const params = useLocalSearchParams();
  const bookTitle = params.title;
  const bookId = params.id;

  const [quotes, setQuotes] = useState<QuotesProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedQuote, setSelectedQuote] = useState<QuotesProps | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const loadQuotes = useCallback(async () => {
    try {
      const id = Array.isArray(bookId) ? bookId[0] : bookId;
      const data = await fetchQuotesById(id);
      setQuotes(data);
    } catch (error) {
      console.log("FETCHING_QUOTES_ERROR:", error);
    }
  }, [bookId]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        await loadQuotes();
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    const channel = supabase
      .channel("quotes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quotes",
        },
        async (payload) => {
          console.log("Real-time update received:", payload);
          await loadQuotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadQuotes]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadQuotes();
    setIsRefreshing(false);
  }, [loadQuotes]);

  function handleCloseModal() {
    setIsEditing(false);
    setShowModal(false);
    setSelectedQuote(null);
    setConfirmDelete(false);
  }

  async function handleDeleteQuote() {
    if (!selectedQuote) return;

    try {
      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", selectedQuote.id);

      if (error) {
        console.log("DELETE_QUOTE_ERROR:", error);
        return;
      }

      setConfirmDelete(false);
      setSelectedQuote(null);
    } catch (err) {
      console.log("DELETE_QUOTE_CATCH_ERROR:", err);
    }
  }

  async function handleShareQuote() {
    try {
      const message = `
        "${selectedQuote?.quote}"
  
        کتاب: ${bookTitle}
        ${selectedQuote?.page ? `صفحه: ${selectedQuote?.page}` : ""}
  
        ✨ ارسال شده از اپ بیبلیو`.trim();

      await Share.share({
        message,
      });
    } catch (error) {
      console.log("SHARE_ERROR:", error);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <MainHeader
          title="نقل و قول ها"
          back
          plus
          onPressPlusBtn={() => {
            setShowModal(true);
            setIsEditing(false);
            setSelectedQuote(null);
          }}
        />
        {isLoading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={scale(80)} color={COLORS.light.primary} />
          </View>
        ) : (
          <FlatList
            data={quotes}
            contentContainerStyle={[
              styles.content,
              { flex: quotes.length === 0 ? 1 : undefined },
            ]}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <EmptyState label="هیچ نقل و قولی یافت نشد" />
            )}
            renderItem={({ item }) => (
              <RenderQuoteItem
                item={item}
                bookTitle={Array.isArray(bookTitle) ? bookTitle[0] : bookTitle}
                onEdit={() => {
                  setIsEditing(true);
                  setShowModal(true);
                  setSelectedQuote(item);
                }}
                onDelete={() => {
                  setConfirmDelete(true);
                  setSelectedQuote(item);
                }}
                onShare={() => {
                  setSelectedQuote(item);
                  handleShareQuote();
                }}
              />
            )}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
        )}
      </View>
      <QuoteModal
        visible={showModal}
        title={isEditing ? "ویرایش نقل و قول" : "افزودن نقل و قول"}
        onRequestClose={handleCloseModal}
        onClose={handleCloseModal}
        btnLabel={isEditing ? "ویرایش" : "افزودن"}
        defaultValues={selectedQuote}
        bookId={Array.isArray(bookId) ? bookId[0] : bookId}
        bookTitle={Array.isArray(bookTitle) ? bookTitle[0] : bookTitle}
      />
      <DeleteModal
        visible={confirmDelete}
        onRequestClose={handleCloseModal}
        title={"حذف نقل و قول"}
        message={"مطمئنی میخوای خذفش کنی؟"}
        btnLabel={"حذف نقل و قول"}
        onCancel={handleCloseModal}
        onDelete={handleDeleteQuote}
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
  content: {
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(18),
    gap: 8,
  },
});
