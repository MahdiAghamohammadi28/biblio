import { JSX } from "react";
import { DimensionValue, StyleProp, ViewStyle } from "react-native";
import { icons } from "./constants/icons";

export interface OnboardingProps {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface BtnProps {
  children: React.ReactNode;
  variant: "default" | "outline" | "ghost";
  width: DimensionValue;
  height: DimensionValue;
  textColor?: string;
  borderColor?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingIndicatorSize?: number;
  loadingIndicatorColor?: string;
  style?: StyleProp<ViewStyle>;
  fontSize?: DimensionValue;
}

export type IconRenderer = (
  size: number,
  color: string,
  stroke: number
) => JSX.Element;

export interface SvgIconsProps {
  name: keyof typeof icons;
  size?: number;
  color: string;
  stroke: number;
}
