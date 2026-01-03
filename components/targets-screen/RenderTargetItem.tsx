import { COLORS } from "@/constants/colors";
import { fetchGoalProgress } from "@/features/targets";
import { TargetsProps } from "@/type";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import { supabase } from "@/utils/supabase";
import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";
import Divider from "../ui/Divider";

interface RenderTargetItemProps {
  item: TargetsProps;
  onEdit: () => void;
}

export function getTypeLabel(type: TargetsProps["type"]) {
  switch (type) {
    case "pages":
      return "صفحه";
    case "books":
    default:
      return "کتاب";
  }
}

export function getPeriodLabel(type: TargetsProps["period"]) {
  switch (type) {
    case "daily":
      return "روزانه";
    case "weekly":
      return "هفتگی";
    case "monthly":
    default:
      return "ماهانه";
  }
}

interface ProgressProps {
  percentage: number;
  progress: number;
}

export default function RenderTargetItem({
  item,
  onEdit,
}: RenderTargetItemProps) {
  const [progress, setProgress] = useState<ProgressProps | null>(null);

  useEffect(() => {
    async function loadGoalProgress() {
      const res = await fetchGoalProgress(item);
      setProgress(res);
    }
    loadGoalProgress();
  }, [item]);

  async function handleStatusChange(status: boolean) {
    try {
      if (status === true) {
        const { error } = await supabase
          .from("reading_goals")
          .update({
            is_active: false,
          })
          .eq("id", item.id);

        if (error) {
          throw Error("خطا در بروزرسانی وضعیت هدف");
        }
      } else {
        const { error } = await supabase
          .from("reading_goals")
          .update({
            is_active: true,
          })
          .eq("id", item.id);

        if (error) {
          throw Error("خطا در بروزرسانی وضعیت هدف");
        }
      }
    } catch (err) {
      console.log("UPDATE_GOAL_ACTIVE_STATUS_ERROR", err);
    }
  }

  async function handleDeleteGoal() {
    try {
      const { error } = await supabase
        .from("reading_goals")
        .delete()
        .eq("id", item.id);
      if (error) {
        throw Error("خطا در حذف هدف");
      }
    } catch (err) {
      console.log("DELETE_GOAL_ERROR:", err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.text}>
              نوع هدف: {""}
              <Text>{getTypeLabel(item.type)}</Text>
            </Text>
            <Divider color="#888" />
            <Text style={styles.text}>
              بازه زمانی: {""}
              <Text>{getPeriodLabel(item.period)}</Text>
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.text}>
              تاریخ شروع: {""}
              <Text>{moment(item.start_date).format("jYYYY/jMM/jDD")}</Text>
            </Text>
            <Divider color="#888" />
            <Text style={styles.text}>
              تاریخ پایان: {""}
              <Text>{moment(item.end_date).format("jYYYY/jMM/jDD")}</Text>
            </Text>
          </View>
          <Text
            style={[
              styles.text,
              {
                color:
                  item.is_active === true
                    ? COLORS.light.primary
                    : COLORS.light.error,
                fontSize: moderateScale(12),
                opacity: 1,
              },
            ]}
          >
            وضعیت فعلی: {""}
            <Text>{item.is_active === true ? "فعال" : "غیرفعال"}</Text>
          </Text>
        </View>
        <View style={{ alignItems: "center", gap: verticalScale(4) }}>
          <AnimatedCircularProgress
            size={scale(80)}
            width={8}
            fill={progress ? progress.percentage : 0}
            tintColor={COLORS.light.primary}
            backgroundColor="#e3e3e3"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.progressContent}>
                <Text style={styles.progressText}>
                  %{getFarsiDigits((progress?.percentage ?? 0).toString())}
                </Text>
              </View>
            )}
          </AnimatedCircularProgress>
          {progress && (
            <Text style={styles.progressMeta}>
              {getFarsiDigits(progress.progress.toString())} از{" "}
              {getFarsiDigits(item.target_value.toString())}{" "}
              {getTypeLabel(item.type)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.btns}>
        <Btn
          label={item.is_active === true ? "غیرفعال کردن" : "فعال کردن"}
          variant={item.is_active === true ? "destructive" : "default"}
          style={styles.btn}
          labelStyle={{ color: COLORS.light.primaryBtnText }}
          onPress={() => handleStatusChange(item.is_active)}
        />
        <Btn
          label="ویرایش"
          variant="default"
          style={styles.btn}
          labelStyle={{ color: COLORS.light.primaryBtnText }}
          onPress={onEdit}
          disabled={item.is_active === false}
        />
        <Btn
          icon
          iconName="trash"
          iconColor="#fff"
          iconSize={24}
          iconStroke={1.5}
          variant="destructive"
          style={{ width: scale(50), height: verticalScale(30) }}
          labelStyle={{ color: COLORS.light.primaryBtnText }}
          onPress={handleDeleteGoal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    padding: moderateScale(12),
    borderRadius: 12,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    paddingBottom: verticalScale(6),
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(16),
    color: COLORS.light.primary,
    marginBottom: verticalScale(8),
  },
  text: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(10),
    marginBottom: verticalScale(6),
    opacity: 0.7,
  },
  progressContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: moderateScale(14),
    fontFamily: "IranYekan-Bold",
    color: COLORS.light.text,
  },
  status: {
    width: scale(120),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(4),
    paddingVertical: verticalScale(2),
    borderRadius: 12,
  },
  progressMeta: {
    fontFamily: "IranYekan-Bold",
    fontSize: moderateScale(14),
    color: COLORS.light.text,
  },
  btns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(4),
    paddingTop: verticalScale(6),
  },
  btn: {
    width: scale(120),
    height: verticalScale(30),
  },
});
