import MainHeader from "@/components/header/MainHeader";
import NoteModal from "@/components/notes-screen/NoteModal";
import RenderNoteItem from "@/components/notes-screen/RenderNoteItem";
import EmptyState from "@/components/ui/EmptyState";
import DeleteModal from "@/components/utils/DeleteModal";
import { COLORS } from "@/constants/colors";
import { fetchNotes } from "@/features/notes";
import { NotesProps } from "@/type";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";

export default function Notes() {
  const params = useLocalSearchParams();
  const bookId = params.id;

  const [notes, setNotes] = useState<NotesProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<NotesProps | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const loadNotes = useCallback(async () => {
    try {
      const id = Array.isArray(bookId) ? bookId[0] : bookId;
      const data = await fetchNotes(id);
      setNotes(data);
    } catch (error) {
      console.log("FETCHING_NOTES_ERROR:", error);
    }
  }, [bookId]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        await loadNotes();
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    const channel = supabase
      .channel("notes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        async (payload) => {
          console.log("Real-time update received:", payload);
          await loadNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadNotes]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadNotes();
    setIsRefreshing(false);
  }, [loadNotes]);

  function handleCloseModal() {
    setIsEditing(false);
    setShowModal(false);
    setSelectedNote(null);
    setConfirmDelete(false);
  }

  async function handleDeleteNote() {
    if (!selectedNote) return;

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", selectedNote.id);

      if (error) {
        console.log("DELETE_NOTES_ERROR:", error);
        return;
      }

      setConfirmDelete(false);
      setSelectedNote(null);
    } catch (err) {
      console.log("DELETE_NOTE_CATCH_ERROR:", err);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <MainHeader
          title="یادداشت ها"
          back
          plus
          onPressPlusBtn={() => {
            setShowModal(true);
            setIsEditing(false);
            setSelectedNote(null);
          }}
        />
        {isLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size={scale(80)} color={COLORS.light.primary} />
          </View>
        ) : (
          <FlatList
            data={notes}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <EmptyState label="هیچ یادداشتی یافت نشد" />
            )}
            renderItem={({ item }) => (
              <RenderNoteItem
                item={item}
                onEdit={() => {
                  setIsEditing(true);
                  setShowModal(true);
                  setSelectedNote(item);
                }}
                onDelete={() => {
                  setConfirmDelete(true);
                  setSelectedNote(item);
                }}
              />
            )}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
        )}
      </View>
      <NoteModal
        visible={showModal}
        title={isEditing ? "ویرایش یادداشت" : "افزودن یادداشت"}
        onRequestClose={handleCloseModal}
        onClose={handleCloseModal}
        bookId={Array.isArray(bookId) ? bookId[0] : bookId}
        btnLabel={isEditing ? "ویرایش" : "افزودن"}
        defaultValues={selectedNote}
      />
      <DeleteModal
        visible={confirmDelete}
        onRequestClose={handleCloseModal}
        title={`خذف ${selectedNote?.title}`}
        message="مطمئنی میخوای حذفش کنی؟"
        btnLabel="حذف یادداشت"
        onCancel={handleCloseModal}
        onDelete={handleDeleteNote}
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
    flex: 1,
    padding: moderateScale(12),
    gap: 8,
  },
});
