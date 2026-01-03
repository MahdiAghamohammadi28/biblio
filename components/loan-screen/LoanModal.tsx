import Btn from "@/components/ui/Btn";
import { COLORS } from "@/constants/colors";
import { LoanModalProps } from "@/type";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import { supabase } from "@/utils/supabase";
import { Moment } from "moment-jalaali";
import React, { useState } from "react";
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
import JalaliDatePicker from "../utils/JalaliDatePicker";

interface InputsProps {
  borrowerName: string;
  borroweDate: Moment | null;
  note: string;
}

const NOTE_MAX_LENGTH = 50;

export default function LoanModal({
  visible,
  onCancel,
  btnLabel,
  bookId,
}: LoanModalProps) {
  const { top } = useSafeAreaInsets();

  const [inputs, setInputs] = useState<InputsProps>({
    borrowerName: "",
    borroweDate: null,
    note: "",
  });
  const [error, setError] = useState("");

  function handleChange(
    name: keyof InputsProps,
    value: string | number | Moment
  ) {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleCloseModal() {
    onCancel();
    setInputs({
      borrowerName: "",
      borroweDate: null,
      note: "",
    });
    setError("");
  }

  async function handleSubmit() {
    if (!inputs.borrowerName.trim() && !inputs.borroweDate) {
      setError("نام امانت گیرنده و تاریخ الزامی است.");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("loan").insert({
        user_id: user?.id,
        book_id: bookId,
        borrower_name: inputs.borrowerName.trim(),
        borrowed_at: inputs.borroweDate,
        note: inputs.note.trim(),
      });

      if (error) {
        console.log(error);
        setError("خطایی رخ داد، دوباره تلاش کن");
        return;
      }
    } catch (err) {
      console.log("QUOTE_SUBMIT_ERROR:", err);
      setError("خطایی رخ داده است");
      return;
    }
    onCancel();
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      animationType="slide"
      statusBarTranslucent
    >
      <View style={[styles.content, { paddingTop: top }]}>
        <Text style={styles.title}>افزودن به امانتی ها</Text>
        <ScrollView
          contentContainerStyle={{
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>نام امانت گیرنده</Text>
            <TextInput
              inputMode="text"
              style={styles.input}
              onChangeText={(value) => handleChange("borrowerName", value)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>تاریخ امانت</Text>
            <JalaliDatePicker
              value={inputs.borroweDate}
              onChange={(value) => handleChange("borroweDate", value)}
              placeholder="--/--/----"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>توضیحات</Text>
            <TextInput
              inputMode="text"
              style={styles.input}
              multiline
              onChangeText={(value) => handleChange("note", value)}
              maxLength={NOTE_MAX_LENGTH}
            />
            <Text style={styles.counter}>
              {`${getFarsiDigits(inputs.note.length)} / ${getFarsiDigits(
                NOTE_MAX_LENGTH
              )}`}
            </Text>
          </View>
          <Text
            style={{
              color: COLORS.light.error,
              fontFamily: "IranYekan-Regular",
            }}
          >
            {error}
          </Text>
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
  content: {
    position: "fixed",
    width: "100%",
    height: "100%",

    backgroundColor: COLORS.light.white,
    borderRadius: 12,
    padding: moderateScale(12),
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
  counter: {
    fontFamily: "IranYekan-Regular",
    alignSelf: "flex-end",
    marginTop: verticalScale(4),
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
