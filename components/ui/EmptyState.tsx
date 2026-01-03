import { COLORS } from "@/constants/colors";
import { EmptyListProps } from "@/type";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Btn from "./Btn";

export default function EmptyState({
  label,
  btn,
  btnLabel,
  onPress,
}: EmptyListProps) {
  return (
    <View style={styles.emptyList}>
      <Text style={styles.emptyListTitle}>{label}</Text>
      {btn && (
        <Btn
          label={btnLabel}
          variant="default"
          style={{
            height: verticalScale(32),
            paddingHorizontal: moderateScale(12),
            marginVertical: verticalScale(6),
          }}
          labelStyle={{
            color: COLORS.light.primaryBtnText,
            fontSize: moderateScale(16),
          }}
          onPress={onPress ?? (() => {})}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyListTitle: {
    fontFamily: "IranYekan-Bold",
    fontSize: moderateScale(16),
    marginBottom: verticalScale(12),
  },
});
