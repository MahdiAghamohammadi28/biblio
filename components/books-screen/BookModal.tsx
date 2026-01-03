import Btn from "@/components/ui/Btn";
import { COLORS } from "@/constants/colors";
import { BookModalProps, InputsProps } from "@/type";
import { getEnglishNumber } from "@/utils/getEnglishNumber";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import { supabase } from "@/utils/supabase";
import moment, { Moment } from "moment-jalaali";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Dropdown from "../utils/Dropdown";
import JalaliDatePicker from "../utils/JalaliDatePicker";

export default function BookEditModal({
  visible,
  onRequestClose,
  title,
  btnLabel,
  onClose,
  defaultValues,
}: BookModalProps) {
  const { top } = useSafeAreaInsets();

  const [inputs, setInputs] = useState<InputsProps>({
    title: "",
    author: "",
    translator: "",
    publisher: "",
    status: "",
    totalPage: 0,
    readPage: 0,
    started_date: null,
    genre: "",
    description: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (visible) {
      if (defaultValues) {
        setInputs({
          title: defaultValues.title ?? "",
          author: defaultValues.author ?? "",
          translator: defaultValues.translator ?? "",
          publisher: defaultValues.publisher ?? "",
          status: defaultValues.status ?? "",
          totalPage: defaultValues.total_pages ?? 0,
          readPage: defaultValues.read_pages ?? 0,
          genre: defaultValues.genre ?? "",
          description: defaultValues.description ?? "",
          started_date: defaultValues.started_date
            ? moment(defaultValues.started_date)
            : null,
        });
      } else {
        setInputs({
          title: "",
          author: "",
          translator: "",
          publisher: "",
          status: "",
          totalPage: 0,
          readPage: 0,
          genre: "",
          description: "",
          started_date: null,
        });
      }
      setError("");
    }
  }, [visible, defaultValues]);

  function handleChange(
    name: keyof InputsProps,
    value: string | number | Moment
  ) {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    if (!inputs.title.trim() || !inputs.author.trim()) {
      setError("نام کتاب و نویسنده الزامی است.");
      return;
    }
    if (
      inputs.status === "reading" &&
      !inputs.totalPage &&
      !inputs.readPage &&
      !inputs.started_date
    ) {
      setError(
        "تعداد کل صفحات، صفحات خوانده شده و تاریخ شروع مطالعه الزامی است."
      );
      return;
    }
    if (
      inputs.status === "reading" &&
      inputs.totalPage > 0 &&
      inputs.readPage > inputs.totalPage
    ) {
      setError("تعداد صفحات خوانده شده نباید از کل صفحات بیشتر باشد.");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("کاربر شناسایی نشد");
        return;
      }

      const payload: any = {
        user_id: user.id,
        title: inputs.title.trim(),
        author: inputs.author.trim(),
      };

      // optional fields
      if (inputs.translator.trim()) payload.translator = inputs.translator;
      if (inputs.publisher.trim()) payload.publisher = inputs.publisher;
      if (inputs.genre.trim()) payload.genre = inputs.genre;
      if (inputs.description.trim()) payload.description = inputs.description;
      if (inputs.status) payload.status = inputs.status;
      if (inputs.totalPage > 0) payload.total_pages = inputs.totalPage;
      if (inputs.status === "reading" && inputs.readPage > 0) {
        payload.read_pages = inputs.readPage;
      }
      if (inputs.started_date) payload.started_date = inputs.started_date;

      if (defaultValues?.id) {
        const { error: editError } = await supabase
          .from("books")
          .update(payload)
          .eq("id", defaultValues.id);
        const { error: readingError } = await supabase
          .from("reading")
          .update({ current_page: inputs.readPage })
          .eq("book_id", defaultValues.id);

        const { data: reading } = await supabase
          .from("reading")
          .select("*")
          .eq("book_id", defaultValues.id);

        if (inputs.status === "reading" && reading?.length === 0) {
          const { error: readingEditError } = await supabase
            .from("reading")
            .insert({
              user_id: user.id,
              book_id: defaultValues.id,
              title: defaultValues.title,
              total_pages: inputs.totalPage,
              current_page: inputs.readPage,
              started_date: inputs.started_date,
            });

          if (readingEditError) {
            setError("خطا در افزودن مطالعه");
            return;
          }
        }
        if (inputs.status !== "reading") {
          const { error: readingDeleteError } = await supabase
            .from("reading")
            .delete()
            .eq("book_id", defaultValues.id);
          if (readingDeleteError) {
            setError("خطا در حذف مطالعه");
            return;
          }
        }

        if (
          inputs.status === "reading" &&
          typeof defaultValues.read_pages === "number" &&
          inputs.readPage !== defaultValues.read_pages
        ) {
          const pagesDiff = inputs.readPage - (defaultValues.read_pages ?? 0);

          if (pagesDiff > 0) {
            const { error: logError } = await supabase
              .from("reading_logs")
              .insert({
                user_id: user.id,
                book_id: defaultValues.id,
                pages_read: pagesDiff,
              });

            if (logError) {
              console.log("READING_LOG_ERROR:", logError);
            }
          }
        }

        if (editError || readingError) {
          setError("خطا در ویرایش کتاب");
          return;
        }
      } else {
        const { data: newBook, error: addBookError } = await supabase
          .from("books")
          .insert(payload)
          .select()
          .single();

        if (addBookError) {
          setError("خطا در ایجاد کتاب جدید");
        }

        if (inputs.status === "reading" && newBook) {
          const { error } = await supabase.from("reading").insert({
            user_id: user.id,
            book_id: newBook.id,
            title: inputs.title,
            total_pages: inputs.totalPage,
            current_page: inputs.readPage,
            started_date: inputs.started_date,
          });

          if (error) {
            setError("خطا در ایجاد مطالعه جدید");
          }
        }
      }

      handleCloseModal();
    } catch (err) {
      console.log("BOOK_SUBMIT_ERROR:", err);
      setError("خطایی رخ داده است");
    }
  }

  function handleCloseModal() {
    onClose();
    setInputs({
      title: "",
      author: "",
      translator: "",
      publisher: "",
      status: "",
      totalPage: 0,
      readPage: 0,
      genre: "",
      description: "",
      started_date: null,
    });
    setError("");
  }

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={[styles.container, { paddingTop: top }]}>
        <Text style={styles.title}>{title}</Text>
        {error && (
          <View
            style={{
              paddingHorizontal: moderateScale(12),
              marginBottom: verticalScale(8),
            }}
          >
            <Text
              style={{
                color: COLORS.light.error,
                fontFamily: "IranYekan-Regular",
              }}
            >
              {error}
            </Text>
          </View>
        )}
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            paddingHorizontal: moderateScale(12),
            paddingBottom: verticalScale(130),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>نام کتاب</Text>
            <TextInput
              inputMode="text"
              style={styles.input}
              value={inputs.title}
              onChangeText={(value) => handleChange("title", value)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>نویسنده</Text>
            <TextInput
              inputMode="text"
              style={styles.input}
              value={inputs.author}
              onChangeText={(value) => handleChange("author", value)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>مترجم</Text>
            <TextInput
              inputMode="text"
              style={styles.input}
              value={inputs.translator}
              onChangeText={(value) => handleChange("translator", value)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>انتشارات</Text>
            <TextInput
              inputMode="text"
              style={styles.input}
              value={inputs.publisher}
              onChangeText={(value) => handleChange("publisher", value)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>ژانر کتاب</Text>
            <TextInput
              inputMode="text"
              keyboardType="default"
              style={styles.input}
              value={inputs.genre}
              onChangeText={(value) => handleChange("genre", value)}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>تعداد کل صفحات</Text>
            <TextInput
              style={styles.input}
              value={getFarsiDigits(inputs.totalPage.toString())}
              onChangeText={(value) =>
                handleChange("totalPage", getEnglishNumber(value))
              }
            />
          </View>
          <View
            style={[
              styles.inputWrapper,
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
          >
            <Dropdown
              label="وضعیت مطالعه"
              options={[
                { value: "unread", label: "خوانده نشده" },
                { value: "reading", label: "در حال مطالعه" },
                { value: "completed", label: "خوانده شده" },
              ]}
              placeholder="یکی از وضعیت مطالعه را انتخاب کنید"
              onSelect={(value) => handleChange("status", value)}
              value={inputs.status}
              style={{
                width: inputs.status === "reading" ? scale(150) : "100%",
              }}
            />
            {inputs.status === "reading" && (
              <View style={[styles.inputWrapper, { width: scale(150) }]}>
                <Text style={styles.inputLabel}>صفحات خوانده شده</Text>
                <TextInput
                  style={styles.input}
                  value={getFarsiDigits(inputs.readPage.toString())}
                  onChangeText={(value) =>
                    handleChange("readPage", getEnglishNumber(value))
                  }
                />
              </View>
            )}
          </View>
          {inputs.status === "reading" && (
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>تاریخ شروع مطالعه</Text>
              <JalaliDatePicker
                value={inputs.started_date}
                onChange={(value) => handleChange("started_date", value)}
                placeholder="--/--/----"
              />
            </View>
          )}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>درباره کتاب</Text>
            <TextInput
              inputMode="text"
              keyboardType="default"
              style={[
                styles.input,
                {
                  maxHeight: verticalScale(150),
                  height: "100%",
                  verticalAlign: "top",
                },
              ]}
              multiline
              value={inputs.description}
              onChangeText={(value) => handleChange("description", value)}
            />
          </View>
        </ScrollView>
        <View style={styles.btns}>
          <Btn
            label={btnLabel}
            variant="default"
            style={{
              width: scale(100),
              paddingHorizontal: moderateScale(12),
              paddingVertical: verticalScale(6),
            }}
            labelStyle={{ color: COLORS.light.primaryBtnText }}
            onPress={handleSubmit}
          />
          <Btn
            label={"بستن"}
            variant="ghost"
            style={{
              width: scale(100),
              paddingHorizontal: moderateScale(12),
              paddingVertical: verticalScale(6),
            }}
            onPress={handleCloseModal}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light.white,
    position: "fixed",
    width: "100%",
    height: "100%",
    direction: "rtl",
  },
  title: {
    fontFamily: "IranYekan-Extrabold",
    fontSize: moderateScale(20),
    textAlign: "center",
    marginVertical: verticalScale(10),
  },
  inputWrapper: {
    marginBottom: verticalScale(8),
  },
  inputLabel: {
    fontFamily: "IranYekan-Regular",
    fontSize: moderateScale(12),
    marginBottom: verticalScale(4),
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
    borderRadius: 10,
    height: verticalScale(40),
    paddingHorizontal: moderateScale(12),
    fontFamily: "IranYekan-Regular",
  },
  btns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: verticalScale(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.light.borderColor,
  },
});
