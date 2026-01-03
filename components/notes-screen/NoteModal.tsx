import Btn from "@/components/ui/Btn";
import { COLORS } from "@/constants/colors";
import { NoteModalProps } from "@/type";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
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
  title: string;
  content: string;
}

export default function NoteModal({
  visible,
  onRequestClose,
  title,
  btnLabel,
  onClose,
  bookId,
  defaultValues,
}: NoteModalProps) {
  const { top } = useSafeAreaInsets();
  const [error, setError] = useState<string>("");

  const [inputs, setInputs] = useState<InputsProps>({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (visible) {
      if (defaultValues) {
        setInputs({
          title: defaultValues.title ?? "",
          content: defaultValues.content ?? "",
        });
      } else {
        setInputs({
          title: "",
          content: "",
        });
      }
    }
    setError("");
  }, [defaultValues, visible]);

  async function handleSubmit() {
    if (!inputs.content.trim() && !inputs.title.trim()) {
      setError("عنوان و متن یادداشت الزامی است");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("کاربر شناسایی نشد");
        router.replace("/(auth)/signin");
        return;
      }

      const payload: any = {
        user_id: user.id,
        book_id: bookId,
        title: inputs.title.trim(),
        content: inputs.content.trim(),
      };

      let result;

      if (defaultValues?.id) {
        result = await supabase
          .from("notes")
          .update(payload)
          .eq("id", defaultValues.id);
      } else {
        result = await supabase.from("notes").insert(payload);
      }
      if (result.error) {
        setError("خطایی رخ داده است، دوباره تلاش کنید");
      }
    } catch (err) {
      console.log("NOTE_SUBMIT_ERROR:", err);
      setError("خطایی رخ داده است");
      return;
    }
    handleCloseModal();
  }

  function handleCloseModal() {
    onClose();
    setInputs({
      title: "",
      content: "",
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
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>عنوان یادداشت</Text>
              <TextInput
                style={styles.input}
                value={inputs.title}
                onChangeText={(value) => handleChange("title", value)}
              />
            </View>
            <Text style={styles.inputLabel}>متن یادداشت</Text>
            <TextInput
              style={[styles.input, { height: verticalScale(180) }]}
              value={inputs.content}
              multiline
              onChangeText={(value) => handleChange("content", value)}
              textAlignVertical="top"
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
