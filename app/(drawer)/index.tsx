import MainHeader from "@/components/header/MainHeader";
import DailyQuote from "@/components/home-screen/DailyQuote";
import ReadingChart from "@/components/home-screen/ReadingChart";
import Statics from "@/components/home-screen/Statics";
import { COLORS } from "@/constants/colors";
import { ScrollView, StyleSheet, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

export default function Index() {
  return (
    <View style={styles.container}>
      <MainHeader title="خانه" drawer />
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          paddingHorizontal: moderateScale(12),
          paddingBottom: verticalScale(10),
          paddingTop: verticalScale(12),
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <DailyQuote />
        <Statics />
        <ReadingChart />
      </ScrollView>
      {/* <Link href={"/welcome"}>Welcome</Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.bg,
    direction: "rtl",
  },
});
