import MainHeader from "@/components/header/MainHeader";
import Btn from "@/components/ui/Btn";
import { COLORS } from "@/constants/colors";
import { icons } from "@/constants/icons";
import {
  ExternalPathString,
  RelativePathString,
  router,
  useLocalSearchParams,
} from "expo-router";

import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

const Btns: {
  title: string;
  icon: keyof typeof icons;
  url: RelativePathString | ExternalPathString;
}[] = [
  {
    title: "درباره کتاب",
    icon: "info",
    url: "/(screens)/about-book" as RelativePathString,
  },
  {
    title: "نقل و قول ها",
    icon: "quote-up",
    url: "/(screens)/quotes" as RelativePathString,
  },
  {
    title: "یادداشت ها",
    icon: "notes",
    url: "/(screens)/notes" as RelativePathString,
  },
];

export default function BookDetail() {
  const book = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <MainHeader
        title={
          typeof book.title === "string"
            ? book.title
            : Array.isArray(book.title)
            ? book.title[0]
            : ""
        }
        back
      />
      <FlatList
        data={Btns}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Btn
            label={item.title}
            variant="outline"
            icon
            iconName={item.icon}
            iconSize={24}
            iconColor={COLORS.light.icon}
            iconStroke={1.2}
            style={{
              height: verticalScale(50),
              borderColor: COLORS.light.borderColor,
            }}
            labelStyle={{ fontSize: moderateScale(16) }}
            onPress={() => router.push({ pathname: item.url, params: book })}
          />
        )}
        contentContainerStyle={styles.content}
      />
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
    gap: 8,
  },
  btn: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    borderRadius: 12,
    padding: moderateScale(12),
    margin: moderateScale(6),
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    backgroundColor: COLORS.light.white,
  },
  btnText: {
    fontFamily: "IranYekan-Bold",
    fontSize: moderateScale(16),
    color: COLORS.light.text,
    marginTop: verticalScale(10),
  },
});
