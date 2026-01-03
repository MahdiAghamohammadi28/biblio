import { COLORS } from "@/constants/colors";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import moment, { Moment } from "moment-jalaali";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";

interface Month {
  value: number;
  label: string;
}

interface DatePickerProps {
  value?: Moment | null;
  onChange: (date: Moment) => void;
  placeholder?: string;
  style?: StyleProp<ViewProps>;
  disabled?: boolean;
}

function getDaysInMonth(year: number, month: number): number {
  return moment.jDaysInMonth(year, month - 1);
}

moment.loadPersian({
  dialect: "persian-modern",
  usePersianDigits: true,
});

export default function JalaliDatePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  style,
  disabled,
}: DatePickerProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Moment>(value || moment());

  const currentYear = moment().jYear();
  const years: number[] = Array.from(
    { length: 100 },
    (_, i) => currentYear - 50 + i
  );
  const months = useMemo<Month[]>(
    () => [
      { value: 1, label: "فروردین" },
      { value: 2, label: "اردیبهشت" },
      { value: 3, label: "خرداد" },
      { value: 4, label: "تیر" },
      { value: 5, label: "مرداد" },
      { value: 6, label: "شهریور" },
      { value: 7, label: "مهر" },
      { value: 8, label: "آبان" },
      { value: 9, label: "آذر" },
      { value: 10, label: "دی" },
      { value: 11, label: "بهمن" },
      { value: 12, label: "اسفند" },
    ],
    []
  );

  const [tempYear, setTempYear] = useState<number>(selectedDate.jYear());
  const [tempMonth, setTempMonth] = useState<number>(selectedDate.jMonth() + 1);
  const [tempDay, setTempDay] = useState<number>(selectedDate.jDate());

  const daysInMonth = getDaysInMonth(tempYear, tempMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const yearRef = useRef<FlatList>(null);
  const monthRef = useRef<FlatList>(null);
  const dayRef = useRef<FlatList>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setTempYear(value.jYear());
      setTempMonth(value.jMonth() + 1);
      setTempDay(value.jDate());
    }
  }, [value]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        // Scroll to year
        const yearIndex = years.findIndex((year) => year === tempYear);
        if (yearIndex !== -1) {
          yearRef.current?.scrollToIndex({
            index: yearIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }

        // Scroll to month
        const monthIndex = months.findIndex(
          (month) => month.value === tempMonth
        );
        if (monthIndex !== -1) {
          monthRef.current?.scrollToIndex({
            index: monthIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }

        // Scroll to day
        const dayIndex = days.findIndex((day) => day === tempDay);
        if (dayIndex !== -1) {
          dayRef.current?.scrollToIndex({
            index: dayIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }, 100);
    } else {
      const base = moment();
      setTempYear(base.jYear());
      setTempMonth(base.jMonth() + 1);
      setTempDay(base.jDate());
    }
  }, [visible, days, years, months, tempDay, tempMonth, tempYear, value]);

  function formatDisplayDate(date: Moment): string {
    return date.format("jYYYY/jMM/jDD");
  }

  function handleMonthChange(monthValue: number): void {
    setTempMonth(monthValue);
    const newDaysInMonth = getDaysInMonth(tempYear, monthValue);
    if (tempDay > newDaysInMonth) {
      setTempDay(newDaysInMonth);
    }
  }

  function handleConfirm() {
    const now = moment();

    const newDate = moment(`${tempYear}/${tempMonth}/${tempDay}`, "jYYYY/jM/jD")
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second());

    setSelectedDate(newDate);
    onChange?.(newDate);
    setVisible(false);
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.dropdownBtn}
        onPress={() => setVisible(true)}
        disabled={disabled}
      >
        <Text style={styles.dropdownBtnText}>
          {value ? formatDisplayDate(moment(value)) : placeholder}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.backdrop}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>انتخاب تاریخ</Text>
            </View>

            <View style={styles.pickersContainer}>
              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>سال</Text>
                <FlatList
                  ref={yearRef}
                  data={years}
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pickerItem,
                        tempYear === item && styles.pickerItemSelected,
                      ]}
                      onPress={() => setTempYear(item)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempYear === item && styles.pickerItemTextSelected,
                        ]}
                      >
                        {getFarsiDigits(item)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  getItemLayout={(data, index) => ({
                    length: verticalScale(48),
                    offset: verticalScale(43.5) * index,
                    index,
                  })}
                  onScrollToIndexFailed={(info) => {
                    setTimeout(() => {
                      yearRef.current?.scrollToIndex({
                        index: info.index,
                        animated: true,
                        viewPosition: 0.5,
                      });
                    }, 100);
                  }}
                />
              </View>
              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>ماه</Text>
                <FlatList
                  ref={monthRef}
                  data={months}
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        tempMonth === item.value && styles.pickerItemSelected,
                      ]}
                      onPress={() => handleMonthChange(item.value)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempMonth === item.value &&
                            styles.pickerItemTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                  getItemLayout={(data, index) => ({
                    length: verticalScale(48),
                    offset: verticalScale(43.5) * index,
                    index,
                  })}
                  onScrollToIndexFailed={(info) => {
                    setTimeout(() => {
                      monthRef.current?.scrollToIndex({
                        index: info.index,
                        animated: true,
                        viewPosition: 0.5,
                      });
                    }, 100);
                  }}
                />
              </View>
              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>روز</Text>
                <FlatList
                  ref={dayRef}
                  data={days}
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        tempDay === item && styles.pickerItemSelected,
                      ]}
                      onPress={() => setTempDay(item)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempDay === item && styles.pickerItemTextSelected,
                        ]}
                      >
                        {getFarsiDigits(item)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  getItemLayout={(data, index) => ({
                    length: verticalScale(48),
                    offset: verticalScale(43.5) * index,
                    index,
                  })}
                  onScrollToIndexFailed={(info) => {
                    setTimeout(() => {
                      dayRef.current?.scrollToIndex({
                        index: info.index,
                        animated: true,
                        viewPosition: 0.5,
                      });
                    }, 100);
                  }}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Btn
                label="تایید"
                variant="default"
                style={{
                  width: scale(120),
                  paddingHorizontal: moderateScale(12),
                  paddingVertical: verticalScale(6),
                }}
                labelStyle={{ color: COLORS.light.white }}
                onPress={handleConfirm}
              />
              <Btn
                label="لغو"
                variant="ghost"
                style={{ width: scale(120) }}
                onPress={() => setVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dropdownBtn: {
    justifyContent: "center",
    height: verticalScale(40),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    paddingHorizontal: moderateScale(12),
    borderRadius: 10,
  },
  dropdownBtnText: {
    fontFamily: "IranYekan-Regular",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(12),
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "100%",
    padding: moderateScale(12),
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.light.borderColor,
    paddingBottom: verticalScale(8),
  },
  headerTitle: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(18),
    color: COLORS.light.primary,
  },
  pickersContainer: {
    flexDirection: "row-reverse",
    padding: moderateScale(10),
    direction: "rtl",
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: moderateScale(5),
  },
  pickerLabel: {
    fontSize: moderateScale(14),
    fontFamily: "IranYekan-Medium",
    textAlign: "center",
    marginBottom: verticalScale(10),
  },
  scrollView: {
    maxHeight: verticalScale(180),
  },
  pickerItem: {
    padding: moderateScale(12),
    borderRadius: 10,
    marginBottom: verticalScale(4),
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: COLORS.light.primary,
  },
  pickerItemText: {
    fontSize: moderateScale(14),
    fontFamily: "IranYekan-Regular",
  },
  pickerItemTextSelected: {
    color: COLORS.light.white,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: verticalScale(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.light.borderColor,
    gap: 10,
  },
});
