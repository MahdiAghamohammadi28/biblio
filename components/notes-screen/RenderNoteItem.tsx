import { COLORS } from "@/constants/colors";
import { NotesProps } from "@/type";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";

interface RenderNoteItemProps {
  item: NotesProps;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RenderNoteItem({
  item,
  onEdit,
  onDelete,
}: RenderNoteItemProps) {
  return (
    <View style={styles.container}>
      <View
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          paddingBottom: verticalScale(8),
          borderColor: COLORS.light.borderColor,
        }}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          paddingTop: verticalScale(10),
        }}
      >
        <Btn
          variant="ghost"
          label="ویرایش"
          icon
          iconName="edit"
          iconColor={COLORS.light.icon}
          iconSize={20}
          iconStroke={1.5}
          onPress={onEdit}
        />

        <Btn
          variant="ghost"
          label="حذف"
          icon
          iconName="trash"
          iconColor={COLORS.light.error}
          labelStyle={{ color: COLORS.light.error }}
          iconSize={20}
          iconStroke={1.5}
          onPress={onDelete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    padding: moderateScale(12),
    borderRadius: 12,
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    color: COLORS.light.primary,
    fontSize: moderateScale(16),
  },
  content: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    color: COLORS.light.text,
  },
});
