import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

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

  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsSessionLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isSessionLoading) return;

    // If the user IS authenticated and currently on an auth screen, move them to the app
    if (session) {
      router.replace("/(drawer)");
      return;
    }

    // If the user is NOT authenticated, handle first-time flow
    if (!session) {
      router.replace("/(auth)/signup");
    }
  }, [session, isSessionLoading]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
