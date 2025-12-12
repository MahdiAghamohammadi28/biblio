import { COLORS } from "@/constants/colors";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

export default function RenderOnboardingItem({ item }: { item: any }) {
  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.img} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width: width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  imageContainer: {
    width: scale(220),
    height: verticalScale(220),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
    borderRadius: 32,
  },
  img: {
    height: "100%",
    borderRadius: 50,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(24),
    color: COLORS.light.text,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "IranYekan-Extrabold",
  },
  description: {
    fontSize: moderateScale(16),
    color: COLORS.light.text,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "IranYekan-Regular",
  },
});
