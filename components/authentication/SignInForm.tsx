import { COLORS } from "@/constants/colors";
import SvgIcons from "@/constants/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "@/utils/supabase";
import { Link, router } from "expo-router";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { z } from "zod";
import Btn from "../ui/Btn";

const { width } = Dimensions.get("window");

const signInSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید."),
  password: z.string(),
});

type SignIn = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignIn) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setSignInError("ایمیل یا رمز عبور صحیح نمی باشد");
      return;
    }

    router.replace("/(drawer)");
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.form}>
      <View style={styles.formField}>
        <Text style={styles.inputLabel}>ایمیل</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              inputMode="email"
              style={[
                styles.input,
                {
                  borderColor: errors.email
                    ? COLORS.light.error
                    : "rgba(40,40,40,0.3)",
                },
              ]}
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              textAlign="left"
            />
          )}
          rules={{ required: true }}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>
      <View style={styles.formField}>
        <Text style={styles.inputLabel}>رمز عبور</Text>
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: errors.password
                ? COLORS.light.error
                : "rgba(40,40,40,0.3)",
            },
          ]}
        >
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <TextInput
                inputMode="text"
                keyboardType="default"
                autoCapitalize="none"
                textAlign="left"
                style={{ width: scale(270), paddingLeft: moderateScale(8) }}
                secureTextEntry={showPass ? false : true}
                value={value}
                onChangeText={onChange}
              />
            )}
            rules={{ required: true }}
          />
          <TouchableOpacity onPress={() => setShowPass((show) => !show)}>
            <SvgIcons
              name={showPass ? "eye-slash" : "eye"}
              size={20}
              color="rgba(40,40,40,0.3)"
              stroke={1.5}
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
      </View>
      {signInError && <Text style={styles.errorText}>{signInError}</Text>}
      <Btn
        variant="default"
        label="ورود"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingDotsColor={COLORS.light.white}
        style={{
          width: "100%",
          height: verticalScale(40),
          marginTop: verticalScale(12),
          borderColor: COLORS.light.primary,
        }}
        labelStyle={{
          color: COLORS.light.primaryBtnText,
          fontSize: moderateScale(14),
        }}
      />

      <View style={styles.redirection}>
        <Text style={styles.redirectionLabel}>ثبت نام نکرده اید؟</Text>
        <Link href="/(auth)/signup">
          <Text style={styles.redirectionLink}>ثبت نام</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    width,
    paddingHorizontal: moderateScale(24),
  },
  formField: {
    width: "100%",
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(14),
    marginBottom: 8,
  },
  inputWrapper: {
    direction: "ltr",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "rgba(40, 40, 40,0.3)",
    height: verticalScale(40),
    alignItems: "center",
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "rgba(40, 40, 40,0.3)",
    height: verticalScale(40),
    paddingHorizontal: moderateScale(8),
  },
  errorText: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    marginVertical: verticalScale(4),
    color: COLORS.light.error,
  },
  redirection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: verticalScale(8),
    gap: 5,
  },
  redirectionLabel: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(14),
  },
  redirectionLink: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(14),
    color: COLORS.light.primary,
  },
});
