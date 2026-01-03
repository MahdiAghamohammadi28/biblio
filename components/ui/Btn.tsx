import Loading from "@/components/ui/Loading";
import { COLORS } from "@/constants/colors";
import SvgIcons from "@/constants/icons";
import { BtnProps } from "@/type";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function getBorderColor(variant: BtnProps["variant"]) {
  switch (variant) {
    case "default":
      return COLORS.light.primary;
    case "destructive":
      return COLORS.light.error;
    case "outline":
      return COLORS.light.borderColor;
    case "ghost":
    default:
      return "transparent";
  }
}

export default function Btn({
  label,
  variant = "default",
  icon,
  onPress,
  disabled,
  loading,
  loadingDotsColor,
  loadingDotsSize,
  style,
  labelStyle,
  iconName,
  iconSize,
  iconColor,
  iconStroke,
}: BtnProps) {
  return (
    <TouchableOpacity
      style={[
        style,
        styles.btn,
        styles[variant],
        {
          borderWidth: variant === "outline" ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <SvgIcons
          name={iconName}
          size={iconSize}
          color={iconColor}
          stroke={iconStroke}
        />
      )}
      {label && !loading && (
        <Text style={[styles.btnText, labelStyle]}>{label}</Text>
      )}
      {loading && (
        <Loading dotSize={loadingDotsSize} dotColor={loadingDotsColor} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
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
  destructive: {
    backgroundColor: COLORS.light.error,
  },
  btnText: {
    fontFamily: "IranYekan-Medium",
  },
});
