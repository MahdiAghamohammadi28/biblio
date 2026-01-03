import MainHeader from "@/components/header/MainHeader";
import ReadingModal from "@/components/reading-screen/ReadingModal";
import RenderReadingItem from "@/components/reading-screen/RenderReadingItem";
import EmptyState from "@/components/ui/EmptyState";
import { COLORS } from "@/constants/colors";
import { fetchReading } from "@/features/reading";
import { ReadingProps } from "@/type";
import { supabase } from "@/utils/supabase";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function Studing() {
  const [isLoaing, setIsLoaing] = useState<boolean>(false);
  const [reading, setReading] = useState<ReadingProps[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedReading, setSelectedReading] = useState<ReadingProps | null>(
    null
  );

  const loadData = useCallback(async () => {
    try {
      const data = await fetchReading();
      setReading(data);
    } catch (error) {
      console.log("FETCHING_READING_ERROR:", error);
    }
  }, []);

  useEffect(() => {
    async function loadReading() {
      try {
        setIsLoaing(true);
        await loadData();
      } finally {
        setIsLoaing(false);
      }
    }
    loadReading();

    const channel = supabase
      .channel("reading_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reading",
        },
        async (payload) => {
          console.log("Real-time update received:", payload);
          await loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  }, [loadData]);

  return (
    <>
      <View style={styles.container}>
        <MainHeader
          title="در حال مطالعه"
          drawer
          plus
          onPressPlusBtn={() => {
            setShowModal(true);
            setIsEditing(false);
            setSelectedReading(null);
          }}
        />
        {isLoaing ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={scale(80)} color={COLORS.light.primary} />
          </View>
        ) : (
          <FlatList
            data={reading}
            ListEmptyComponent={<EmptyState label="هنوز کتابی رو شروع نکردی" />}
            contentContainerStyle={[
              styles.content,
              {
                flex: reading.length === 0 ? 1 : undefined,
              },
            ]}
            renderItem={({ item }) => (
              <RenderReadingItem
                item={item}
                onEdit={() => {
                  setShowModal(true);
                  setSelectedReading(item);
                  setIsEditing(true);
                }}
              />
            )}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
      <ReadingModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        title={isEditing ? "بروزرسانی" : "افزودن کتاب"}
        defaultValues={selectedReading}
        isEditing={isEditing}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: "rtl",
    backgroundColor: COLORS.light.bg,
  },
  content: {
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(18),
    gap: 8,
  },
});
