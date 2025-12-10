import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "IranYekan-Thin": require("@/assets/fonts/Iranyekan-Thin.ttf"),
    "IranYekan-Light": require("@/assets/fonts/Iranyekan-Light.ttf"),
    "IranYekan-Regular": require("@/assets/fonts/Iranyekan-Regular.ttf"),
    "IranYekan-Medium": require("@/assets/fonts/Iranyekan-Medium.ttf"),
    "IranYekan-Bold": require("@/assets/fonts/Iranyekan-Bold.ttf"),
    "IranYekan-Extrabold": require("@/assets/fonts/Iranyekan-Extrabold.ttf"),
    "IranYekan-Black": require("@/assets/fonts/Iranyekan-Black.ttf"),
    "IranYekan-Extrablack": require("@/assets/fonts/Iranyekan-Extrablack.ttf"),
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <Stack />;
}
