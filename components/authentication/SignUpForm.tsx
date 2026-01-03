import { COLORS } from "@/constants/colors";
import SvgIcons from "@/constants/icons";
import { checkEmailExists } from "@/features/auth";
import { supabase } from "@/utils/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
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
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { z } from "zod";
import Btn from "../ui/Btn";

const { width } = Dimensions.get("window");

const signUpSchema = z.object({
  name: z.string().min(2, "نام حداقل باید ۲ حرف باشد."),
  email: z.string().email("ایمیل معتبر وارد کنید."),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(/[a-z]/, "رمز عبور باید شامل حروف کوچک باشد")
    .regex(/[A-Z]/, "رمز عبور باید شامل حروف بزرگ باشد")
    .regex(/[0-9]/, "رمز عبور باید شامل عدد باشد")
    .regex(/[^A-Za-z0-9]/, "رمز عبور باید شامل سمبل مانند !@#$% باشد"),
});

type SignUp = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSendConfirmEmail: () => void;
}
export default function SignUpForm({ onSendConfirmEmail }: SignUpFormProps) {
  const [showPass, setShowPass] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignUp) {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
        },
      });

      if (error) {
        console.log(error);
        throw Error("خطا در ثبت نام. دباره تلاش کنید");
      }
      onSendConfirmEmail();
    } catch (error) {
      console.log("SIGN UP ERROR:", error);
    }
  }

  const debouncedCheckEmail = React.useRef(
    debounce(async (email: string) => {
      if (!email) return;

      const exists = await checkEmailExists(email);

      if (exists) {
        setError("email", {
          type: "manual",
          message: "این ایمیل قبلاً ثبت شده است",
        });
        return;
      } else {
        clearErrors("email");
      }
    }, 600)
  ).current;

  useEffect(() => {
    return () => {
      debouncedCheckEmail.cancel();
    };
  }, [debouncedCheckEmail]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.form}>
      <View style={styles.formField}>
        <Text style={styles.inputLabel}>نام</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              inputMode="text"
              style={[
                styles.input,
                {
                  borderColor: errors.name
                    ? COLORS.light.error
                    : "rgba(40,40,40,0.3)",
                },
              ]}
              keyboardType="default"
              value={value}
              onChangeText={onChange}
              textAlign="right"
            />
          )}
          rules={{ required: true }}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
      </View>
      <View style={styles.formField}>
        <Text style={styles.inputLabel}>ایمیل</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextInput
              inputMode="email"
              style={[
                styles.input,
                {
                  fontFamily: "Poppins-Regular",
                  borderColor: errors.email
                    ? COLORS.light.error
                    : "rgba(40,40,40,0.3)",
                },
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="left"
              value={value}
              onChangeText={(text) => {
                debouncedCheckEmail(text);
                onChange(text);
              }}
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
      <Btn
        label="ثبت نام"
        variant="default"
        labelStyle={{
          color: COLORS.light.primaryBtnText,
          fontSize: moderateScale(14),
        }}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingDotsSize={10}
        loadingDotsColor={COLORS.light.white}
        style={{
          width: "100%",
          height: verticalScale(40),
          marginTop: verticalScale(12),
          borderColor: COLORS.light.primary,
        }}
      />

      <View style={styles.redirection}>
        <Text style={styles.redirectionLabel}>قبلا ثبت نام کرده اید؟</Text>
        <Link href="/(auth)/signin">
          <Text style={styles.redirectionLink}>ورود</Text>
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
