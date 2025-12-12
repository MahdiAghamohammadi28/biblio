import Btn from "@/components/onboarding-screen/ui/Btn";
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
          variant={"default"}
          width={scale(200)}
          height={verticalScale(40)}
          textColor={COLORS.light.primaryBtnText}
          onPress={() => router.replace("(auth)/sigup")}
        >
          ثبت نام
        </Btn>
        <Btn
          variant="outline"
          width={scale(200)}
          height={verticalScale(40)}
          textColor={COLORS.light.primary}
          borderColor={COLORS.light.primary}
          onPress={() => router.replace("(auth)/sigin")}
        >
          ورود
        </Btn>
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
