import MainHeader from "@/components/header/MainHeader";
import { COLORS } from "@/constants/colors";
import { getStatusLabel } from "@/utils/getStatusLabel";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

export default function AboutBook() {
  const book = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <MainHeader title="درباره کتاب" back />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ marginBottom: verticalScale(12) }}>
          <Text style={styles.contentLabel}>اطلاعات کتاب:</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>
              عنوان کتاب: {""}
              <Text style={styles.contentTextValue}>{book.title}</Text>
            </Text>
            <Text style={styles.contentText}>
              نویسنده: {""}
              <Text style={styles.contentTextValue}>{book.author}</Text>
            </Text>
            {book.translator && (
              <Text style={styles.contentText}>
                مترجم: {""}
                <Text style={styles.contentTextValue}>{book.translator}</Text>
              </Text>
            )}
            {book.publisher && (
              <Text style={styles.contentText}>
                انتشارت: {""}
                <Text style={styles.contentTextValue}>{book.publisher}</Text>
              </Text>
            )}
            {book.total_pages && (
              <Text style={styles.contentText}>
                تعداد صفحات: {""}
                <Text style={styles.contentTextValue}>{book.total_pages}</Text>
              </Text>
            )}

            <Text style={styles.contentText}>
              وضعیت مطالعه: {""}
              <Text style={styles.contentTextValue}>
                {getStatusLabel(
                  book.status as "unread" | "reading" | "completed"
                ) || "نامشخص"}
              </Text>
            </Text>

            {book.status === "reading" && (
              <Text style={styles.contentText}>
                تعداد صفحات خوانده شده: {""}
                <Text style={styles.contentTextValue}>{book.read_pages}</Text>
              </Text>
            )}
          </View>
        </View>
        <View>
          <Text style={styles.contentLabel}>درباره کتاب:</Text>
          <View style={styles.contentBox}>
            <Text style={styles.description}>
              {book.description
                ? book.description
                : "هیچ توضیحی درباره کتاب وجود ندارد"}
            </Text>
          </View>
        </View>
      </ScrollView>
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
    padding: moderateScale(12),
  },
  contentLabel: {
    fontFamily: "IranYekan-Bold",
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
  },
  contentBox: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    padding: moderateScale(12),
    borderRadius: 12,
    backgroundColor: COLORS.light.white,
    elevation: 2,
  },
  contentText: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
  },
  contentTextValue: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(14),
  },
  description: {
    fontFamily: "IranYekan-Medium",
    textAlign: "justify",
    lineHeight: verticalScale(26),
  },
});
