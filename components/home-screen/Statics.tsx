import { fetchBookStatics } from "@/features/books";
import { COLORS } from "@/constants/colors";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

interface StaticsProps {
  totalBooks: number;
  completedBooks: number;
  unreadBooks: number;
}

export default function Statics() {
  const [statics, setStatics] = useState<StaticsProps>({
    totalBooks: 0,
    completedBooks: 0,
    unreadBooks: 0,
  });

  useEffect(() => {
    async function fetchStatics() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      try {
        if (!user?.id) throw Error("کاربر شناسایی نشد.");
        const statics = await fetchBookStatics(user.id);
        setStatics(statics);
      } catch (err) {
        console.log("QUOTE_FETCH_ERROR:", err);
      }
    }
    fetchStatics();
  }, []);

  return (
    <View>
      <Text style={styles.title}>آمار کتاب های شما</Text>
      <View style={{ gap: 8 }}>
        <View style={styles.box}>
          <Text style={styles.staticValue}>
            {getFarsiDigits(statics.totalBooks)}
          </Text>
          <Text style={styles.staticLabel}>تعداد کل کتاب ها</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.staticValue}>
            {getFarsiDigits(statics.completedBooks)}
          </Text>
          <Text style={styles.staticLabel}>تعداد کتاب ها خوانده شده</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.staticValue}>
            {getFarsiDigits(statics.unreadBooks)}
          </Text>
          <Text style={styles.staticLabel}>تعداد کتاب ها خوانده نشده</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(18),
    marginBottom: verticalScale(8),
    color: COLORS.light.primary,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: moderateScale(12),
    backgroundColor: COLORS.light.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    borderRadius: 12,
  },
  staticValue: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(26),
    color: COLORS.light.primary,
  },
  staticLabel: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(16),
  },
});
