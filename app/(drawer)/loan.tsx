import MainHeader from "@/components/header/MainHeader";
import RenderLoanItem from "@/components/loan-screen/RenderLoanItem";
import EmptyState from "@/components/ui/EmptyState";
import { COLORS } from "@/constants/colors";
import { fetchLoanedBooks } from "@/features/loan";
import { LoanProps } from "@/type";
import { supabase } from "@/utils/supabase";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function Loan() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loanedBooks, setLoanedBooks] = useState<LoanProps[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadLoanedBooks = useCallback(async () => {
    try {
      const data = await fetchLoanedBooks();
      setLoanedBooks(data);
    } catch (error) {
      console.log("FETCHING_LOANED_BOOKS_ERROR:", error);
    }
  }, []);

  useEffect(() => {
    async function loadBook() {
      try {
        setIsLoading(true);
        await loadLoanedBooks();
      } finally {
        setIsLoading(false);
      }
    }
    loadBook();

    const channel = supabase
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
          await loadLoanedBooks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadLoanedBooks]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadLoanedBooks();
    setIsRefreshing(false);
  }, [loadLoanedBooks]);

  return (
    <View style={styles.container}>
      <MainHeader title="امانتی ها" drawer />
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size={scale(80)} color={COLORS.light.primary} />
        </View>
      ) : (
        <FlatList
          data={loanedBooks}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <RenderLoanItem item={item} />}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          contentContainerStyle={[
            styles.content,
            { flex: loanedBooks.length === 0 ? 1 : undefined },
          ]}
          ListEmptyComponent={<EmptyState label="هیچ موردی یافت نشد." />}
        />
      )}
    </View>
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
