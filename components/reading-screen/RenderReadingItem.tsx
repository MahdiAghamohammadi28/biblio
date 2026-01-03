import { COLORS } from "@/constants/colors";
import { ReadingProps } from "@/type";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import { supabase } from "@/utils/supabase";
import moment from "moment-jalaali";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";
import Divider from "../ui/Divider";

interface RenderReadingIteProps {
  item: ReadingProps;
  onEdit: () => void;
}

export default function RenderReadingItem({
  item,
  onEdit,
}: RenderReadingIteProps) {
  const calculateProgress = () => {
    if (item.current_page <= 0) return 0;
    const progress = (item.current_page / item.total_pages) * 100;
    return Math.min(progress, 100);
  };

  const progress = calculateProgress();

  async function handleDeleteReading(item: ReadingProps) {
    try {
      const { error } = await supabase
        .from("reading")
        .delete()
        .eq("id", item.id);

      const { error: bookError } = await supabase
        .from("books")
        .update({
          status: "unread",
          read_pages: 0,
          started_date: null,
        })
        .eq("id", item.book_id);

      if (error || bookError) {
        throw Error("خطا در حذف مطالعه");
      }
    } catch (err) {
      console.log("DELETE_READING_ERROR:", err);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={styles.title}>
            کتاب <Text>{item.title}</Text>
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.text}>
              کل صفحات: <Text>{getFarsiDigits(item.total_pages)}</Text>
            </Text>
            <Divider color={"#888"} />
            <Text style={styles.text}>
              خوانده شده: <Text>{getFarsiDigits(item.current_page)}</Text>
            </Text>
          </View>
          <Text style={styles.text}>
            تاریخ شروع: {""}
            <Text>
              {moment(item.started_date).format("jYYYY/jMM/jDD").toString()}
            </Text>
          </Text>
          <View style={styles.btns}>
            <Btn
              label="بروزرسانی"
              variant="default"
              style={{ width: scale(100), height: verticalScale(26) }}
              labelStyle={{ color: COLORS.light.primaryBtnText }}
              disabled={item.current_page === item.total_pages}
              onPress={onEdit}
            />
            <Btn
              variant="destructive"
              icon
              iconName="trash"
              iconColor={COLORS.light.white}
              style={{ width: scale(50), height: verticalScale(26) }}
              labelStyle={{ color: COLORS.light.primaryBtnText }}
              onPress={() => handleDeleteReading(item)}
            />
          </View>
        </View>
        <AnimatedCircularProgress
          size={80}
          width={8}
          fill={progress}
          tintColor={COLORS.light.primary}
          backgroundColor="#e3e3e3"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.progressContent}>
              <Text style={styles.progressText}>
                %{getFarsiDigits(Math.round(progress))}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
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
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(16),
    color: COLORS.light.primary,
  },
  text: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    marginBottom: verticalScale(4),
    color: COLORS.light.black,
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
  btns: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
});
