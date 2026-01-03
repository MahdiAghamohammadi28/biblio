import OnboardingDots from "@/components/onboarding-screen/OnboardingDots";
import RenderOnboardingItem from "@/components/onboarding-screen/RenderOnboardingItem";
import { COLORS } from "@/constants/colors";
import { ONBOARDING_DATA } from "@/constants/onboarding";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const isLastSlide = currentIndex === ONBOARDING_DATA.length - 1;

  function handleGetStarted() {
    router.push("/welcome");
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RenderOnboardingItem item={item} />}
        style={{ flex: 1 }}
        inverted
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <View style={styles.bottomContainer}>
        {isLastSlide ? (
          <TouchableOpacity style={styles.btn} onPress={handleGetStarted}>
            <Text style={styles.btnText}>شروع برنامه</Text>
          </TouchableOpacity>
        ) : (
          <OnboardingDots currentIndex={currentIndex} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.light.bg,
  },
  bottomContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: COLORS.light.primary,
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(12),
    borderRadius: 25,
    elevation: 5,
  },
  btnText: {
    color: COLORS.light.white,
    fontSize: moderateScale(14),
    textAlign: "center",
    fontFamily: "IranYekan-Medium",
  },
});
