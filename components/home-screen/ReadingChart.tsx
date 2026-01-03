import { COLORS } from "@/constants/colors";
import { fetchReadingLog } from "@/features/reading";
import { supabase } from "@/utils/supabase";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory-native";
import Tabs from "../ui/Tabs";

const TABS: { label: string; value: string }[] = [
  { label: "روزانه", value: "daily" },
  { label: "هفتگی", value: "weekly" },
  { label: "ماهانه", value: "monthly" },
];

interface ChartProps {
  label: string;
  value: number;
  [key: string]: unknown;
}

export default function ReadingChart() {
  const [tab, setTab] = useState<string>("daily");
  const [data, setData] = useState<ChartProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadLogs = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw Error("کاربر شناسایی نشد");
      }
      const res = await fetchReadingLog(user?.id, tab);
      setData(res);
    } catch (error) {
      console.log("CHART_ERROR:", error);
    }
  }, [tab]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await loadLogs();
      setLoading(false);
    }
    fetchData();
  }, [loadLogs]);

  console.log("CHART_DATA:", data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>آمار مطالعاتی شما</Text>
      {data.length > 0 && <Tabs items={TABS} value={tab} onChange={setTab} />}
      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: verticalScale(12),
          }}
        >
          <ActivityIndicator size={scale(50)} color={COLORS.light.primary} />
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <VictoryChart
            domainPadding={{ x: 40 }}
            width={scale(350)}
            height={verticalScale(250)}
            animate={{ duration: 500, easing: "bounce" }}
          >
            <VictoryAxis
              crossAxis
              style={{
                axisLabel: {
                  fontFamily: "IranYekan-Medium",
                  fontSize: moderateScale(12),
                },
                tickLabels: {
                  fontFamily: "IranYekan-Medium",
                  fontSize: moderateScale(10),
                  angle: -45,
                  textAnchor: "end",
                  padding: moderateScale(8),
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axisLabel: {
                  fontFamily: "IranYekan-Medium",
                  fontSize: moderateScale(12),
                },
                tickLabels: {
                  fontFamily: "IranYekan-Medium",
                  fontSize: moderateScale(12),
                },
                grid: {
                  stroke: "#CFD8DC",
                  strokeDasharray: "10, 5",
                },
              }}
            />
            <VictoryBar
              data={data}
              x="label"
              y="value"
              labels={({ datum }) => datum.value}
              style={{
                data: {
                  fill: COLORS.light.primary,
                },
                labels: {
                  fontFamily: "IranYekan-Medium",
                  fontSize: moderateScale(12),
                },
                border: {
                  borderTopLeftRadius: moderateScale(4),
                  borderTopRightRadius: moderateScale(4),
                },
              }}
            />
          </VictoryChart>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.bg,
    direction: "rtl",
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(18),
    marginBottom: verticalScale(8),
    color: COLORS.light.primary,
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
