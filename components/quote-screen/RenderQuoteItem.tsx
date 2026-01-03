import { COLORS } from "@/constants/colors";
import { QuotesProps } from "@/type";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { moderateScale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";
import Divider from "../ui/Divider";

interface RenderQuoteItemProps {
  item: QuotesProps;
  bookTitle: string;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export default function RenderQuoteItem({
  item,
  bookTitle,
  onEdit,
  onDelete,
  onShare,
}: RenderQuoteItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.quoteText}>{item.quote}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: StyleSheet.hairlineWidth,
          paddingBottom: verticalScale(8),
          borderColor: COLORS.light.borderColor,
        }}
      >
        <Text style={styles.text}>{bookTitle}</Text>
        {item.page && <Divider color={COLORS.light.borderColor} />}
        {item.page && (
          <Text style={styles.text}>
            صفحه: {""}
            <Text>{item.page}</Text>
          </Text>
        )}
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
          label="اشتراک گذاری"
          icon
          iconName="share"
          iconColor={COLORS.light.icon}
          iconSize={20}
          iconStroke={1.5}
          onPress={onShare}
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
  quoteText: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    textAlign: "justify",
    lineHeight: verticalScale(28),
  },
  text: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    color: "#888",
  },
});
