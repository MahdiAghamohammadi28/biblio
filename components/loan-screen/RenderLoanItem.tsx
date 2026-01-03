import { COLORS } from "@/constants/colors";
import { LoanProps } from "@/type";
import { supabase } from "@/utils/supabase";
import moment from "moment-jalaali";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";
import Divider from "../ui/Divider";

export interface RenderLoanItemProp {
  item: LoanProps;
}

export default function RenderLoanItem({ item }: RenderLoanItemProp) {
  const [isReturning, setIsReturning] = useState<boolean>(false);

  async function handleReturnBook() {
    if (isReturning) return;

    try {
      setIsReturning(true);
      const { error } = await supabase
        .from("loan")
        .update({ is_returned: true })
        .eq("id", item.id);

      if (error) {
        console.log("RETURN_BOOK_ERROR:", error);
        throw Error("خطا در تغییر وضعیت امانت کتاب");
      }
    } finally {
      setIsReturning(false);
    }
  }

  async function handleDeleteLoanedBook() {
    try {
      const { error } = await supabase.from("loan").delete().eq("id", item.id);
      if (error) {
        throw Error("خطا در حذف");
      }
    } catch (err) {
      console.log("DELETE_LOAN_BOOK_ERROR:", err);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          کتاب <Text>{item.books.title}</Text>
        </Text>
        <Text style={styles.borroweItem}>
          امانت گیرنده: {""}
          <Text>{item.borrower_name}</Text>
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.borroweItem}>
            تاریخ امانت:{" "}
            {moment(item.borrowed_at).format("jYYYY/jMM/jDD").toString() ?? ""}
          </Text>
          <Divider color={"#888"} />
          <Text style={styles.borroweItem}>
            <Text>
              وضعیت: {""}
              {item.is_returned === false ? "هنوز برنگشته" : "بازگردانده شده"}
            </Text>
          </Text>
        </View>
        <Text style={styles.borroweItem}>
          توضیحات: {""}
          <Text>{item.note}</Text>
        </Text>
      </View>
      <View style={styles.btns}>
        <Btn
          variant="ghost"
          icon
          iconName="square-check-mark"
          iconColor={COLORS.light.primary}
          iconSize={24}
          iconStroke={1.5}
          disabled={isReturning || item.is_returned}
          onPress={handleReturnBook}
        />
        <Btn
          variant="ghost"
          icon
          iconName="trash"
          iconColor={COLORS.light.error}
          iconSize={24}
          iconStroke={1.5}
          onPress={handleDeleteLoanedBook}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(20),
    color: COLORS.light.primary,
  },
  borroweItem: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    marginBottom: verticalScale(4),
    color: COLORS.light.black,
    opacity: 0.7,
  },
  btns: {
    gap: verticalScale(12),
  },
});
