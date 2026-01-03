import Btn from "@/components/ui/Btn";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <View style={styles.context}>
        <Text style={styles.appName}>بیبلیو</Text>
        <Text style={styles.slogan}>هر کتاب، یک تجربه تازه</Text>
      </View>
      <View style={styles.btns}>
        <Btn
          label="ثبت نام"
          variant="default"
          style={{
            width: scale(200),
            height: verticalScale(40),
            borderColor: COLORS.light.primary,
          }}
          labelStyle={{
            color: COLORS.light.primaryBtnText,
            fontSize: moderateScale(14),
          }}
          onPress={() => router.replace("/(auth)/signup")}
        />
        <Btn
          label="ورود"
          variant="outline"
          style={{
            width: scale(200),
            height: verticalScale(40),
            borderColor: COLORS.light.primary,
          }}
          labelStyle={{
            fontSize: moderateScale(14),
            color: COLORS.light.primary,
          }}
          onPress={() => router.replace("/(auth)/signin")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.light.bg,
  },
  context: {
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  appName: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(32),
    color: COLORS.light.text,
    marginBottom: 2,
  },
  slogan: {
    fontFamily: "IranYekan-Medium",
    fontSize: moderateScale(16),
    color: COLORS.light.text,
  },
  btns: {
    gap: verticalScale(10),
  },
});
