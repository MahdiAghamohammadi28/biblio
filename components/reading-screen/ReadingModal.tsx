import { COLORS } from "@/constants/colors";
import { fetchUnreadBooks } from "@/features/books";
import { BookProps, ReadingModalProps } from "@/type";
import { getEnglishNumber } from "@/utils/getEnglishNumber";
import { getFarsiDigits } from "@/utils/getFarsiNumber";
import { supabase } from "@/utils/supabase";
import moment, { Moment } from "moment-jalaali";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Btn from "../ui/Btn";
import Dropdown from "../utils/Dropdown";
import JalaliDatePicker from "../utils/JalaliDatePicker";

interface InputsProps {
  book: string;
  title: string;
  current_page: number;
  total_pages: number;
  started_date: Moment | null;
}

export default function ReadingModal({
  visible,
  onCancel,
  title,
  defaultValues,
  isEditing,
}: ReadingModalProps) {
  const { top } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<BookProps[]>([]);
  const [inputs, setInputs] = useState<InputsProps>({
    book: "",
    title: "",
    total_pages: 0,
    current_page: 0,
    started_date: null,
  });
  const [error, setError] = useState<string>("");

  const loadData = useCallback(async () => {
    try {
      const data = await fetchUnreadBooks();
      setBooks(data);
    } catch (error) {
      console.log("FETCHING_BOOKS_ERROR:", error);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      if (defaultValues?.id) {
        setInputs({
          book: defaultValues.book_id ?? "",
          title: defaultValues.title ?? "",
          total_pages: defaultValues.total_pages ?? 0,
          current_page: defaultValues.current_page ?? 0,
          started_date: defaultValues.started_date
            ? moment(defaultValues.started_date)
            : null,
        });
      } else {
        setInputs({
          book: "",
          title: "",
          total_pages: 0,
          current_page: 0,
          started_date: null,
        });
      }
    }
  }, [defaultValues, visible]);

  useEffect(() => {
    if (!visible) return;

    async function fetchBooks() {
      try {
        setIsLoading(true);
        await loadData();
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooks();
  }, [loadData, visible]);

  const booksList = books.map((book) => {
    return {
      value: book.id,
      label: book.title,
      total_pages: book.total_pages,
    };
  });

  function handleSelectBook(value: string) {
    const selectedBook = booksList.find((book) => book.value === value);

    handleChange("book", value);
    handleChange("title", selectedBook?.label ?? "");
    handleChange("total_pages", selectedBook?.total_pages ?? 0);
  }

  function handleChange(
    name: keyof InputsProps,
    value: string | number | Moment
  ) {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    if (
      !inputs.book.trim() ||
      inputs.total_pages === 0 ||
      !inputs.started_date
    ) {
      setError("تمام موارد الزامی هستند");
      return;
    }

    if (inputs.total_pages > 0 && inputs.current_page > inputs.total_pages) {
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

      if (defaultValues?.id) {
        const { error: readingError } = await supabase
          .from("reading")
          .update({ current_page: inputs.current_page })
          .eq("id", defaultValues.id);

        const { error: bookError } = await supabase
          .from("books")
          .update({
            read_pages: inputs.current_page,
          })
          .eq("id", inputs.book);
        if (
          typeof defaultValues.current_page === "number" &&
          inputs.current_page !== defaultValues.current_page
        ) {
          const pagesDiff =
            inputs.current_page - (defaultValues.current_page ?? 0);

          if (pagesDiff > 0) {
            const { error: logError } = await supabase
              .from("reading_logs")
              .insert({
                user_id: user.id,
                book_id: defaultValues.book_id,
                pages_read: pagesDiff,
              });

            if (logError) {
              console.log("READING_LOG_ERROR:", logError);
            }
          }
        }

        if (readingError || bookError) {
          throw Error("خطا در بروزرسانی، دوباره تلاش کنید");
        }
      } else {
        const { error: ReadingError } = await supabase.from("reading").insert({
          user_id: user.id,
          book_id: inputs.book,
          title: inputs.title,
          total_pages: inputs.total_pages,
          current_page: inputs.current_page,
          started_date: inputs.started_date,
        });
        const { error: BookError } = await supabase
          .from("books")
          .update({
            status: "reading",
            total_pages: inputs.total_pages,
            read_pages: inputs.current_page,
          })
          .eq("id", inputs.book);
        if (ReadingError || BookError) {
          throw Error("خطا در ذخیره اطلاعات، دوباره تلاش کنید");
        }
      }

      handleCloseModal();
    } catch (err) {
      console.log("BOOK_SUBMIT_ERROR:", err);
    }
  }

  function handleCloseModal() {
    onCancel();
    setInputs({
      book: "",
      title: "",
      total_pages: 0,
      current_page: 0,
      started_date: null,
    });
    setError("");
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onCancel}
      animationType="slide"
      statusBarTranslucent
    >
      <View style={[styles.content, { paddingTop: top }]}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            paddingHorizontal: moderateScale(12),
          }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: verticalScale(80),
              }}
            >
              <ActivityIndicator
                size={scale(80)}
                color={COLORS.light.primary}
              />
            </View>
          ) : (
            <>
              <View style={styles.inputWrapper}>
                <Dropdown
                  label="نام کتاب"
                  options={booksList}
                  placeholder="کتاب مورد نظر را انتخاب کنید"
                  value={inputs.book}
                  onSelect={(value) => handleSelectBook(value)}
                  disabled={isEditing}
                />
              </View>
              <View
                style={[styles.inputWrapper, { opacity: isEditing ? 0.5 : 1 }]}
              >
                <Text style={styles.inputLabel}>کل صفحات</Text>
                <TextInput
                  style={styles.input}
                  inputMode="numeric"
                  value={getFarsiDigits(inputs.total_pages.toString())}
                  onChangeText={(value) =>
                    handleChange("total_pages", Number(value))
                  }
                  editable={!isEditing}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>صفحات خوانده شده</Text>
                <TextInput
                  style={styles.input}
                  inputMode="numeric"
                  value={getFarsiDigits(inputs.current_page.toString())}
                  onChangeText={(value) =>
                    handleChange("current_page", getEnglishNumber(value))
                  }
                />
              </View>
              <View
                style={[styles.inputWrapper, { opacity: isEditing ? 0.5 : 1 }]}
              >
                <Text style={styles.inputLabel}>تاریخ شروع مطالعه</Text>
                <JalaliDatePicker
                  value={inputs.started_date}
                  onChange={(value) => handleChange("started_date", value)}
                  placeholder="--/--/----"
                  disabled={isEditing}
                />
              </View>
            </>
          )}
          {error && (
            <View
              style={{
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
        </ScrollView>
        <View style={styles.btns}>
          <Btn
            label="افزودن"
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
  content: {
    backgroundColor: COLORS.light.white,
    flex: 1,
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
    marginBottom: verticalScale(12),
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
