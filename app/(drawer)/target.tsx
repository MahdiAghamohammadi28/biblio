import MainHeader from "@/components/header/MainHeader";
import RenderTargetItem from "@/components/targets-screen/RenderTargetItem";
import TargetModal from "@/components/targets-screen/TargetModal";
import EmptyState from "@/components/ui/EmptyState";
import { COLORS } from "@/constants/colors";
import { fetchTargets } from "@/features/targets";
import { TargetsProps } from "@/type";
import { supabase } from "@/utils/supabase";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function Target() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [targets, setTargets] = useState<TargetsProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] = useState<TargetsProps | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const loadTargets = useCallback(async () => {
    try {
      const data = await fetchTargets();
      setTargets(data);
    } catch (error) {
      console.log("FETCHING_TARGETS_ERROR:", error);
    }
  }, []);

  useEffect(() => {
    async function fetchTargets() {
      try {
        setIsLoading(true);
        await loadTargets();
      } finally {
        setIsLoading(false);
      }
    }
    fetchTargets();

    const channel = supabase
      .channel("goals_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reading_goals",
        },
        async (payload) => {
          console.log("Real-time update received:", payload);
          await loadTargets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTargets]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadTargets();
    setIsRefreshing(false);
  }, [loadTargets]);

  return (
    <>
      <View style={styles.container}>
        <MainHeader
          title="هدف ها"
          drawer
          plus
          onPressPlusBtn={() => {
            setShowModal(true);
            setIsEditing(false);
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
            data={targets}
            ListEmptyComponent={<EmptyState label="هنوز هدفی رو شروع نکردی" />}
            contentContainerStyle={[
              styles.content,
              {
                flex: targets.length === 0 ? 1 : undefined,
              },
            ]}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => (
              <RenderTargetItem
                item={item}
                onEdit={() => {
                  setShowModal(true);
                  setSelectedTarget(item);
                  setIsEditing(true);
                }}
              />
            )}
          />
        )}
      </View>
      <TargetModal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          setIsEditing(false);
        }}
        title={isEditing ? "ویرایش هدف" : "ایجاد هدف"}
        defaultValues={selectedTarget}
        btnLabel={isEditing ? "ویرایش هدف" : "ایجاد هدف"}
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
