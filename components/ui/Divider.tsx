import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface DividerProps {
  color: string;
}

export default function Divider({ color }: DividerProps) {
  return (
    <View style={styles.divider}>
      <Text style={{ color: color }}>|</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: moderateScale(4),
  },
});
