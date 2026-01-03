import SignUpForm from "@/components/authentication/SignUpForm";
import Btn from "@/components/ui/Btn";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function SignUp() {
  const [isEmailSend, setIsEmailSend] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      {isEmailSend ? (
        <View style={styles.emailConfirm}>
          <Text style={styles.emailConfirmText}>
            یک ایمیل تأیید برات فرستاده شد. لطفاً ایمیلت رو چک کن و روی لینک
            تأیید بزن
          </Text>
          <Btn
            variant="ghost"
            label="بازگست به صفحه ورود"
            onPress={() => router.replace("/(auth)/signin")}
            style={{
              width: scale(180),
              height: verticalScale(40),
              marginTop: 20,
            }}
            labelStyle={{ fontSize: moderateScale(12) }}
          />
        </View>
      ) : (
        <>
          <Text style={styles.title}>ایجاد حساب کاربری</Text>
          <SignUpForm onSendConfirmEmail={() => setIsEmailSend(true)} />
        </>
      )}
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
  emailConfirm: {
    paddingHorizontal: moderateScale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  emailConfirmText: {
    fontFamily: "IranYekan-Bold",
    fontSize: moderateScale(18),
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
});
