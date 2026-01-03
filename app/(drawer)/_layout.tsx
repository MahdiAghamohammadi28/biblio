import CustomDrawer from "@/components/drawer/CustomDrawer";
import { COLORS } from "@/constants/colors";
import SvgIcons from "@/constants/icons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { moderateScale, scale } from "react-native-size-matters";

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: scale(250),
        },
        overlayColor: "rgba(0,0,0,0.7)",
        drawerPosition: "right",
        drawerHideStatusBarOnOpen: true,
        drawerType: "slide",
        drawerActiveBackgroundColor: COLORS.light.primary,
        drawerActiveTintColor: COLORS.light.primaryBtnText,
        drawerInactiveTintColor: COLORS.light.text,
        drawerLabelStyle: {
          fontFamily: "IranYekan-Extrabold",
          fontSize: moderateScale(14),
        },
        drawerItemStyle: {
          borderRadius: 12,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "خانه",
          drawerIcon: ({ color }) => (
            <SvgIcons name="home" size={24} color={color} stroke={2} />
          ),
        }}
      />
      <Drawer.Screen
        name="books"
        options={{
          drawerLabel: "لیست کتاب ها",
          drawerIcon: ({ color }) => (
            <SvgIcons name="books" size={24} color={color} stroke={2} />
          ),
        }}
      />
      <Drawer.Screen
        name="loan"
        options={{
          drawerLabel: "امانتی ها",
          drawerIcon: ({ color }) => (
            <SvgIcons name="loan" size={24} color={color} stroke={2} />
          ),
        }}
      />
      <Drawer.Screen
        name="studing"
        options={{
          drawerLabel: "در حال مطالعه",
          drawerIcon: ({ color }) => (
            <SvgIcons name="studing" size={24} color={color} stroke={2} />
          ),
        }}
      />
      <Drawer.Screen
        name="target"
        options={{
          drawerLabel: "هدف ها",
          drawerIcon: ({ color }) => (
            <SvgIcons name="target" size={24} color={color} stroke={2} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "تنظیمات",
          drawerIcon: ({ color }) => (
            <SvgIcons name="settings" size={24} color={color} stroke={2} />
          ),
        }}
      />
    </Drawer>
  );
}
