import { COLORS } from "@/constants/colors";
import { RenderBookItemProps } from "@/type";
import { getStatusLabel } from "@/utils/getStatusLabel";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";
import Divider from "../ui/Divider";

const COLLAPSED_HEIGHT = verticalScale(60);
const EXPANDED_HEIGHT = verticalScale(100);

export default function RenderBookItem({
  item,
  onEdit,
  onLoan,
  onDelete,
}: RenderBookItemProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT, {
        duration: 250,
      }),
    };
  }, [expanded]);

  const controlsStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded ? 1 : 0, { duration: 200 }),
      transform: [
        {
          translateY: withTiming(expanded ? 0 : -8, {
            duration: 200,
          }),
        },
      ],
    };
  }, [expanded]);

  const caretStyle = useAnimatedStyle(() => {
    const rotate = interpolate(expanded ? 1 : 0, [0, 1], [0, 180]);

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  }, [expanded]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setExpanded(false);
      };
    }, [])
  );

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.bookInfo,
          {
            borderBottomWidth: expanded ? StyleSheet.hairlineWidth : 0,
            borderColor: COLORS.light.borderColor,
          },
        ]}
      >
        <View>
          <Link
            href={{
              pathname: "/(screens)/book-detail",
              params: item,
            }}
          >
            <Text style={styles.title}>
              کتاب {""}
              <Text>{item.title}</Text>
            </Text>
          </Link>
          <View style={styles.info}>
            <Text style={styles.text}>
              نوشته {""}
              <Text>{item.author}</Text>
            </Text>
            <Divider color={COLORS.light.divider} />
            <Text style={styles.text}>
              وضعیت مطالعه: {""}
              <Text>{getStatusLabel(item.status)}</Text>
            </Text>
          </View>
        </View>
        <Animated.View style={caretStyle}>
          <Btn
            variant="ghost"
            icon
            iconName="caret-down"
            iconSize={24}
            iconColor={COLORS.light.icon}
            iconStroke={1.5}
            onPress={() => setExpanded((p) => !p)}
          />
        </Animated.View>
      </View>
      <Animated.View
        style={[styles.controls, controlsStyle]}
        pointerEvents={expanded ? "auto" : "none"}
      >
        <Btn
          variant="ghost"
          icon
          iconName="edit"
          iconSize={18}
          iconColor={COLORS.light.icon}
          iconStroke={1.5}
          label="ویرایش"
          onPress={onEdit}
        />
        <Btn
          variant="ghost"
          icon
          iconName="loan"
          iconSize={18}
          iconColor={COLORS.light.icon}
          iconStroke={1.5}
          label={item.isLoaned === true ? "امانت داده شده" : "امانت به..."}
          disabled={item.isLoaned}
          onPress={onLoan}
        />
        <Btn
          variant="ghost"
          icon
          iconName="trash"
          iconSize={18}
          iconColor={COLORS.light.error}
          iconStroke={1.5}
          label="حذف"
          onPress={onDelete}
          labelStyle={{ color: COLORS.light.error }}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.renderItemBg,
    paddingVertical: verticalScale(6),
    paddingHorizontal: moderateScale(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    borderRadius: 14,
    elevation: 3,
    overflow: "hidden",
  },
  bookInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(20),
    color: COLORS.light.primary,
  },
  info: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    marginBottom: verticalScale(8),
    color: COLORS.light.black,
    opacity: 0.7,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: verticalScale(12),
  },
});
