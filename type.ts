import { DimensionValue } from "react-native";

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
}
