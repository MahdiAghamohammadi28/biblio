import { COLORS } from "@/constants/colors";
import { HeaderProps } from "@/type";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";

const { width } = Dimensions.get("window");

export default function MainHeader({
  title,
  drawer,
  back,
  plus,
  onPressPlusBtn,
}: HeaderProps) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: top }]}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>{title}</Text>
        {drawer && (
          <Btn
            icon
            iconName="menu"
            variant="ghost"
            iconStroke={2}
            iconColor={COLORS.light.icon}
            iconSize={24}
            style={styles.menuBtn}
            onPress={() => navigation.openDrawer()}
          />
        )}
        {back && (
          <Btn
            icon
            variant="ghost"
            iconName="caret-right"
            iconSize={24}
            iconStroke={2}
            iconColor={COLORS.light.icon}
            style={styles.menuBtn}
            onPress={() => router.back()}
          />
        )}
        {plus && (
          <Btn
            icon
            variant="ghost"
            iconName="plus"
            iconSize={24}
            iconStroke={2}
            iconColor={COLORS.light.icon}
            style={styles.plusBtn}
            onPress={onPressPlusBtn ?? (() => {})}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.light.bg,
    width: width,
    height: verticalScale(70),
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.3)",
    elevation: 3,
  },
  wrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: moderateScale(12),
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(16),
  },
  menuBtn: {
    position: "absolute",
    right: moderateScale(8),
    top: "50%",
    borderWidth: 0,
  },
  plusBtn: {
    position: "absolute",
    left: moderateScale(8),
    top: "50%",
  },
});
