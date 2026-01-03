import Btn from "@/components/ui/Btn";
import { COLORS } from "@/constants/colors";
import { QuoteModalProps } from "@/type";
import { getEnglishNumber } from "@/utils/getEnglishNumber";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

interface InputsProps {
  quote_text: string;
  quote_page: number;
}

export default function QuoteModal({
  visible,
  onRequestClose,
  title,
  btnLabel,
  onClose,
  bookId,
  defaultValues,
  bookTitle,
}: QuoteModalProps) {
  const { top } = useSafeAreaInsets();
  const [error, setError] = useState<string>("");

  const [inputs, setInputs] = useState<InputsProps>({
    quote_text: "",
    quote_page: 0,
  });

  useEffect(() => {
    if (visible) {
      if (defaultValues) {
        setInputs({
          quote_text: defaultValues.quote ?? "",
          quote_page: defaultValues.page ?? 0,
        });
      } else {
        setInputs({
          quote_text: "",
          quote_page: 0,
        });
      }
    }
    setError("");
  }, [defaultValues, visible]);

  async function handleSubmit() {
    if (!inputs.quote_text.trim()) {
      setError("متن نقل و قول الزامی است.");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("کاربر شناسایی نشد");
        return;
      }

      const payload: any = {
        user_id: user.id,
        book_id: bookId,
        quote: inputs.quote_text.trim(),
        title: bookTitle,
      };
      // optional fields
      if (inputs.quote_page > 0) payload.page = inputs.quote_page;

      console.log(payload, defaultValues?.id);

      let result;

      if (defaultValues?.id) {
        result = await supabase
          .from("quotes")
          .update(payload)
          .eq("id", defaultValues.id);
      } else {
        result = await supabase.from("quotes").insert(payload);
      }
      if (result.error) {
        setError("خطایی رخ داده است، دوباره تلاش کنید");
      }
    } catch (err) {
      console.log("QUOTE_SUBMIT_ERROR:", err);
      setError("خطایی رخ داده است");
      return;
    }
    handleCloseModal();
  }

  function handleCloseModal() {
    onClose();
    setInputs({
      quote_text: "",
      quote_page: 0,
    });
    setError("");
  }

  function handleChange(name: keyof InputsProps, value: string | number) {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View style={[styles.container, { paddingTop: top }]}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            paddingHorizontal: moderateScale(12),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>متن نقل و قول</Text>
            <TextInput
              style={[styles.input, { height: verticalScale(180) }]}
              value={inputs.quote_text}
              multiline
              onChangeText={(value) => handleChange("quote_text", value)}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>صفحه</Text>
            <TextInput
              style={styles.input}
              value={getFarsiDigits(inputs.quote_page.toString())}
              onChangeText={(value) =>
                handleChange("quote_page", getEnglishNumber(value))
              }
            />
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.light.error,
                fontFamily: "IranYekan-Regular",
              }}
            >
              {error}
            </Text>
          )}
        </ScrollView>
        <View style={styles.btns}>
          <Btn
            label={btnLabel}
            variant="default"
            style={{
              width: scale(100),
              paddingHorizontal: moderateScale(12),
              paddingVertical: verticalScale(6),
            }}
            labelStyle={{ color: COLORS.light.primaryBtnText }}
            onPress={handleSubmit}
          />
          <Btn
            label={"بستن"}
            variant="ghost"
            style={{
              width: scale(100),
              paddingHorizontal: moderateScale(12),
              paddingVertical: verticalScale(6),
            }}
            onPress={handleCloseModal}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.white,
    position: "fixed",
    width: "100%",
    height: "100%",
    direction: "rtl",
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(20),
    textAlign: "center",
    marginVertical: verticalScale(10),
  },
  inputWrapper: {
    marginBottom: verticalScale(12),
  },
  inputLabel: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    marginBottom: verticalScale(4),
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    borderRadius: 10,
    height: verticalScale(40),
    paddingHorizontal: moderateScale(12),
    fontFamily: "IranYekan-Regular",
  },
  btns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: verticalScale(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
  },
});
