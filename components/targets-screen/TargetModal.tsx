import { COLORS } from "@/constants/colors";
import { TargetsProps } from "@/type";
import { getEnglishNumber } from "@/utils/getEnglishNumber";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import { supabase } from "@/utils/supabase";
import moment, { Moment } from "moment-jalaali";
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
import Btn from "../ui/Btn";
import Dropdown from "../utils/Dropdown";
import JalaliDatePicker from "../utils/JalaliDatePicker";

interface TargetModalProps {
  visible: boolean;
  onCancel: () => void;
  title: string;
  defaultValues: TargetsProps | null;
  btnLabel: string;
}

interface InputsProps {
  title: string;
  type: string;
  period: string;
  target_value: number;
  start_date: Moment | null;
  end_date: Moment | null;
}

const GOAL_TYPE = [
  { label: "کتاب", value: "books" },
  { label: "صفحه", value: "pages" },
];
const GOAL_PERIOD = [
  { label: "روزانه", value: "daily" },
  { label: "هفتگی", value: "weekly" },
  { label: "ماهانه", value: "monthly" },
];

export default function TargetModal({
  visible,
  onCancel,
  title,
  defaultValues,
  btnLabel,
}: TargetModalProps) {
  const { top } = useSafeAreaInsets();
  const [inputs, setInputs] = useState<InputsProps>({
    title: "",
    type: "",
    period: "",
    target_value: 0,
    start_date: null,
    end_date: null,
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (visible) {
      if (defaultValues?.id) {
        setInputs({
          title: defaultValues.title ?? "",
          type: defaultValues.type ?? "",
          period: defaultValues.period ?? "",
          target_value: defaultValues.target_value ?? 0,
          start_date: defaultValues.start_date
            ? moment(defaultValues.start_date)
            : null,
          end_date: defaultValues.end_date
            ? moment(defaultValues.end_date)
            : null,
        });
      } else {
        setInputs({
          title: "",
          type: "",
          period: "",
          target_value: 0,
          start_date: null,
          end_date: null,
        });
      }
    }
  }, [visible, defaultValues]);

  function handleChange(
    name: keyof InputsProps,
    value: string | Moment | number
  ) {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    console.log(inputs);

    if (
      !inputs.title.trim() ||
      !inputs.type ||
      !inputs.period ||
      !inputs.target_value ||
      !inputs.start_date ||
      !inputs.end_date
    ) {
      setError("تمامی فیلد ها الزامی هستند.");
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

      if (defaultValues?.id) {
        const { error: goalError } = await supabase
          .from("reading_goals")
          .update({
            user_id: user.id,
            title: inputs.title,
            type: inputs.type,
            period: inputs.period,
            target_value: inputs.target_value,
            start_date: inputs.start_date,
            end_date: inputs.end_date,
          })
          .eq("id", defaultValues.id);

        if (goalError) {
          setError("خطا در ایجا هدف");
        }
      } else {
        const { error: goalError } = await supabase
          .from("reading_goals")
          .insert({
            user_id: user.id,
            title: inputs.title,
            type: inputs.type,
            period: inputs.period,
            target_value: inputs.target_value,
            start_date: inputs.start_date,
            end_date: inputs.end_date,
          });

        if (goalError) {
          setError("خطا در ایجا هدف");
        }
      }

      handleCloseModal();
    } catch (err) {
      console.log("GOAL_SUBMIT_ERROR:", err);
      setError("خطایی رخ داده است");
    }
  }

  function handleCloseModal() {
    onCancel();
    setInputs({
      title: "",
      type: "",
      period: "",
      target_value: 0,
      start_date: null,
      end_date: null,
    });
    setError("");
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent
      animationType="slide"
    >
      <View style={[styles.content, { paddingTop: top }]}>
        <Text style={styles.title}>{title}</Text>
        {error && (
          <View
            style={{
              paddingHorizontal: moderateScale(12),
              marginBottom: verticalScale(8),
            }}
          >
            <Text
              style={{
                color: COLORS.light.error,
                fontFamily: "IranYekan-Regular",
              }}
            >
              {error}
            </Text>
          </View>
        )}
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            paddingHorizontal: moderateScale(12),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>عنوان هدف</Text>
            <TextInput
              inputMode="text"
              value={inputs.title}
              onChangeText={(value) => handleChange("title", value)}
              style={styles.input}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Dropdown
              label="نوع هدف"
              options={GOAL_TYPE}
              placeholder="نوع هدف خود را انتخاب کنید"
              value={inputs.type}
              onSelect={(value) => handleChange("type", value)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Dropdown
              label="بازه زمانی"
              options={GOAL_PERIOD}
              placeholder="بازه زمانی خود را انتخاب کنید"
              value={inputs.period}
              onSelect={(value) => handleChange("period", value)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>مقدار هدف</Text>
            <TextInput
              value={getFarsiDigits(inputs.target_value.toString())}
              onChangeText={(value) =>
                handleChange("target_value", getEnglishNumber(value))
              }
              style={styles.input}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>تاریخ شروع هدف</Text>
            <JalaliDatePicker
              value={inputs.start_date}
              onChange={(value) => handleChange("start_date", value)}
              placeholder="--/--/----"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>تاریخ پایان هدف</Text>
            <JalaliDatePicker
              value={inputs.end_date}
              onChange={(value) => handleChange("end_date", value)}
              placeholder="--/--/----"
            />
          </View>
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
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.light.bg,
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
