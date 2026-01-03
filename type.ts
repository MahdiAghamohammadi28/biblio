import { Moment } from "moment-jalaali";
import { JSX } from "react";
import { DimensionValue, StyleProp, TextStyle, ViewStyle } from "react-native";
import { icons } from "./constants/icons";

export interface OnboardingProps {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface BtnProps {
  label?: string;
  variant: "default" | "outline" | "ghost" | "destructive";
  icon?: boolean;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingDotsSize?: DimensionValue;
  loadingDotsColor?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconName?: keyof typeof icons;
  iconSize?: DimensionValue;
  iconColor?: string;
  iconStroke?: DimensionValue;
}

export type IconRenderer = (
  size: number,
  color: string,
  stroke: number
) => JSX.Element;

export interface SvgIconsProps {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  stroke?: number;
}

export interface HeaderProps {
  title: string;
  drawer?: boolean;
  back?: boolean;
  plus?: boolean;
  onPressPlusBtn?: () => void;
}

export interface EmptyListProps {
  label: string;
  btn?: boolean;
  btnLabel?: string;
  onPress?: () => void;
}

export interface LoadingProps {
  dotSize?: DimensionValue;
  dotColor?: string;
  dotSpacing?: DimensionValue;
  duration?: number;
  style?: ViewStyle;
}

export interface BookProps {
  id: string;
  title: string;
  author: string;
  translator?: string;
  publisher?: string;
  status: "unread" | "reading" | "completed";
  total_pages?: number;
  read_pages?: number;
  started_date: Moment | null;
  genre?: string;
  description?: string;
  isLoaned: boolean;
  loan: {
    id: string;
    is_returned: boolean;
  }[];
}

type Option = {
  label: string;
  value: string;
};

export interface DropdownProps {
  label?: string;
  placeholder?: string;
  value: string | null;
  options: Option[];
  onSelect: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export interface BookModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  btnLabel: string;
  onClose: () => void;
  defaultValues?: BookProps | null;
}

export interface RenderBookItemProps {
  item: BookProps;
  onEdit: () => void;
  onLoan: () => void;
  onDelete: () => void;
}

export interface InputsProps {
  title: string;
  author: string;
  translator: string;
  publisher: string;
  status: string;
  totalPage: number;
  readPage: number;
  started_date: Moment | null;
  genre: string;
  description: string;
}

export interface QuotesProps {
  id: string;
  quote: string;
  page: number;
  title: string;
}

export interface QuoteModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  btnLabel: string;
  onClose: () => void;
  bookId: string;
  defaultValues: QuotesProps | null;
  bookTitle: string;
}

export interface NotesProps {
  id: string;
  title: string;
  content: string;
}

export interface NoteModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  btnLabel: string;
  onClose: () => void;
  bookId: string;
  defaultValues: NotesProps | null;
}

export interface LoanProps {
  id: string;
  borrower_name: string;
  borrowed_at: Moment;
  is_returned: boolean;
  note: string;
  books: { id: string; title: string }[];
}

export interface LoanModalProps {
  visible: boolean;
  onCancel: () => void;
  btnLabel: string;
  bookId: string;
}

export interface ReadingProps {
  id: string;
  book_id: string;
  title: string;
  total_pages: number;
  current_page: number;
  started_date: Moment | null;
}

export interface ReadingModalProps {
  visible: boolean;
  onCancel: () => void;
  title: string;
  defaultValues: ReadingProps | null;
  isEditing: boolean;
}

export interface TargetsProps {
  id: string;
  user_id: string;
  title: string;
  type: string;
  period: string;
  target_value: number;
  start_date: Moment;
  end_date: Moment;
  is_active: boolean;
}
