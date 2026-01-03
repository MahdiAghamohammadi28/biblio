// components/ui/Dropdown.tsx
import { COLORS } from "@/constants/colors";
import SvgIcons from "@/constants/icons";
import { DropdownProps } from "@/type";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

export default function Dropdown({
  label,
  placeholder = "Select an option",
  value,
  options,
  onSelect,
  style,
  disabled,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <View style={[styles.container, style, { opacity: disabled ? 0.5 : 1 }]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <Text style={styles.triggerText}>{selectedLabel || placeholder}</Text>
        <SvgIcons
          name="caret-down"
          size={20}
          color={COLORS.light.icon}
          stroke={1.5}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: verticalScale(180), height: "100%" }}
          >
            {options.length > 0 ? (
              <>
                {options.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.item}
                    onPress={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text style={styles.itemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <Text>موردی یافت نشد.</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(8),
    position: "relative",
    width: "100%",
  },
  label: {
    marginBottom: verticalScale(4),
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
  },
  trigger: {
    height: verticalScale(40),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    borderRadius: 10,
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
  },
  triggerText: {
    fontSize: moderateScale(12),
    fontFamily: "IranYekan-Regular",
  },
  dropdown: {
    position: "absolute",
    top: verticalScale(60),
    width: "100%",
    marginTop: verticalScale(4),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    zIndex: 999,
    elevation: 2,
  },
  item: {
    padding: moderateScale(12),
  },
  itemText: {
    fontSize: moderateScale(12),
    fontFamily: "IranYekan-Regular",
  },
});
