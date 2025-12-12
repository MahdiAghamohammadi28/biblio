import { COLORS } from "@/constants/colors";
import { BtnProps } from "@/type";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function Btn({
  children,
  variant = "default",
  width,
  height,
  textColor = COLORS.light.text,
  borderColor = COLORS.light.primary,
  onPress,
}: BtnProps) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        styles[variant],
        {
          width,
          height,
          borderWidth: 1,
          borderColor: variant === "ghost" ? "transparent" : borderColor,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.btnText, { color: textColor }]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  default: {
    backgroundColor: COLORS.light.primary,
  },
  outline: {
    backgroundColor: "transparent",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  btnText: {
    fontFamily: "IranYekan-Medium",
    fontSize: moderateScale(18),
  },
});
