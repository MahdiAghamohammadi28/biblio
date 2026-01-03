import { COLORS } from "@/constants/colors";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function CustomDrawer(props: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.img}
          />
          <View style={{ gap: 2 }}>
            <Text
              style={{
                fontFamily: "IranYekan-Extrabold",
                fontSize: moderateScale(16),
              }}
            >
              بیبلیو
            </Text>
            <Text
              style={{
                fontFamily: "IranYekan-Regular",
                fontSize: moderateScale(12),
              }}
            >
              هر کتاب، یک تجربه تازه
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(40,40,40,0.5)",
        }}
      />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: "rtl",
    flex: 1,
    backgroundColor: COLORS.light.bg,
  },
  header: {
    height: verticalScale(150),
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: moderateScale(12),
    alignItems: "flex-end",
    flexDirection: "row",
  },
  img: {
    width: scale(50),
    height: verticalScale(50),
    borderRadius: 999,
  },
});
