import { supabase } from "@/utils/supabase";
import type { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

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

    if (session) {
      router.replace("/");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isSessionLoading, session]);

  if (!loaded && !error) {
    return null;
  }

  return <Stack />;
}
