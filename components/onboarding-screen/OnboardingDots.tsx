import { COLORS } from "@/constants/colors";
import { ONBOARDING_DATA } from "@/constants/onboarding";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function OnboardingDots({
  currentIndex,
}: {
  currentIndex: number;
}) {
  return (
    <View style={styles.dotsContainer}>
      {ONBOARDING_DATA.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentIndex
                  ? COLORS.light.primary
                  : COLORS.light.accent1,
              width: index === currentIndex ? 20 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dotsContainer: {
    direction: "rtl",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
