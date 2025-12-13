import SignInForm from "@/components/authentication/SignInForm";
import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";

export default function SignIn() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ورود به حساب کاربری</Text>
      <SignInForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    flex: 1,
    backgroundColor: COLORS.light.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(26),
    marginBottom: verticalScale(12),
  },
});
