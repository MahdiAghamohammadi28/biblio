import Btn from "@/components/ui/Btn";
import { COLORS } from "@/constants/colors";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export interface DeleteModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  message: string;
  btnLabel: string;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteModal({
  visible,
  onRequestClose,
  title,
  message,
  btnLabel,
  onCancel,
  onDelete,
}: DeleteModalProps) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.msg}>{message}</Text>
          <View style={styles.btns}>
            <Btn
              label={btnLabel}
              variant="destructive"
              style={{
                width: scale(100),
                paddingVertical: verticalScale(6),
                paddingHorizontal: moderateScale(12),
              }}
              labelStyle={{ color: COLORS.light.destructiveBtnText }}
              onPress={onDelete}
            />
            <Btn
              label={"لغو"}
              variant="ghost"
              style={{
                width: scale(70),
                paddingVertical: verticalScale(6),
                paddingHorizontal: moderateScale(12),
                alignItems: "center",
              }}
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.7)",
    position: "fixed",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(12),
  },
  content: {
    backgroundColor: COLORS.light.white,
    width: "100%",
    borderRadius: 12,
    direction: "rtl",
    padding: moderateScale(12),
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(14),
    color: COLORS.light.error,
    marginBottom: verticalScale(10),
  },
  msg: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(14),
    color: COLORS.light.text,
    marginBottom: verticalScale(10),
  },
  btns: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row",
    marginTop: verticalScale(14),
  },
});
