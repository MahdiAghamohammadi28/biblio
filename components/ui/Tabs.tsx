import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  items: { label: string; value: string }[];
}

export default function Tabs({ value, onChange, items }: TabsProps) {
  return (
    <View style={styles.tabs}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.tab,
              {
                backgroundColor: active ? COLORS.light.primary : undefined,
              },
            ]}
            onPress={() => onChange(item.value)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: active ? COLORS.light.white : COLORS.light.text,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    borderRadius: 9999,
    width: scale(200),
    padding: moderateScale(3),
  },
  tab: {
    width: scale(60),
    height: verticalScale(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  tabText: {
    fontFamily: "IranYekan-Bold",
    fontSize: moderateScale(12),
  },
});
