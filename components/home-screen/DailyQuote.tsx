import { COLORS } from "@/constants/colors";
import SvgIcons from "@/constants/icons";
import { fetchQuotes } from "@/features/quotes";
import { QuotesProps } from "@/type";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Divider from "../ui/Divider";

export default function DailyQuote() {
  const [loading, setLoading] = useState<boolean>(false);
  const [quote, setQuote] = useState<QuotesProps[]>([]);

  useEffect(() => {
    async function loadQuote() {
      try {
        setLoading(true);
        const quote = await fetchQuotes();

        if (quote.length === 0) return;

        const today = new Date().toDateString();
        const index =
          Math.abs(
            quote.reduce((acc, q) => acc + q.id.charCodeAt(0), 0) +
              new Date(today).getDate()
          ) % quote.length;

        setQuote([quote[index]]);
      } catch (err) {
        console.log("QUOTE_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuote();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>نقل و قول روز</Text>
      <View style={styles.box}>
        <View style={styles.icon}>
          <SvgIcons
            name="quote-up"
            size={scale(26)}
            color={COLORS.light.borderColor}
            stroke={1.5}
          />
        </View>
        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={scale(40)} color={COLORS.light.primary} />
          </View>
        ) : (
          <>
            <Text style={styles.text}>
              {quote.length > 0
                ? quote[0].quote
                : "هنوز هیچ نقل و قولی ثبت نشده است."}
            </Text>
            {quote.length > 0 && (
              <View style={styles.bookInfo}>
                <Text style={styles.bookInfoText}>کتاب {quote[0].title}</Text>
                <Divider color="#888" />
                <Text style={styles.bookInfoText}>
                  صفحه: {getFarsiDigits(quote[0].page)}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.bg,
    direction: "rtl",
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(18),
    marginBottom: verticalScale(8),
    color: COLORS.light.primary,
  },
  box: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    padding: moderateScale(24),
    borderRadius: 12,
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: -verticalScale(20),
    left: moderateScale(24),
    backgroundColor: COLORS.light.bg,
    width: scale(40),
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(14),
    lineHeight: verticalScale(24),
    textAlign: "center",
    marginBottom: verticalScale(6),
  },
  bookInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bookInfoText: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    opacity: 0.7,
  },
});
