import React, { useRef, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { FirstStep } from "@/components/(onboarding)/first-step";
import { SecondStep } from "@/components/(onboarding)/second-step";
import { ThirdStep } from "@/components/(onboarding)/third-step";
import { useTranslation } from "@/hooks/use-translation";
import { useAppPreferences } from "@/libs/zustand/app-preference-store";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { SignedOut } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SquircleButton } from "expo-squircle-view";

export default function Page() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const carouselRef = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const { setOnboardingGoal } = useAppPreferences();

  const handleNext = () => {
    if (activeIndex === 0) {
      // First step -> Second step
      carouselRef.current?.scrollTo({ index: activeIndex + 1, animated: true });
      setActiveIndex((prev) => prev + 1);
    } else if (activeIndex === 1) {
      // Second step -> Third step (validate goal selection)
      if (selectedGoal) {
        setOnboardingGoal(selectedGoal);
        carouselRef.current?.scrollTo({ index: activeIndex + 1, animated: true });
        setActiveIndex((prev) => prev + 1);
      }
    } else if (activeIndex === 2) {
      // Third step -> Navigate to auth
      router.navigate("/(auth)");
    }
  };

  const CarouselItems = [
    <FirstStep key="first-step" />,
    <SecondStep key="second-step" onGoalSelected={setSelectedGoal} />,
    <ThirdStep key="third-step" />,
  ];

  return (
    <SignedOut>
      <SafeAreaView edges={["top", "bottom"]} style={styles.wrapper}>
        <View style={{ flex: 1 }}>
          <Carousel
            ref={carouselRef}
            loop={false}
            width={width}
            data={CarouselItems}
            scrollAnimationDuration={500}
            onSnapToItem={(index) => setActiveIndex(index)}
            renderItem={({ item }) => item}
            enabled={false} // Disable swipe on second step
          />
        </View>

        <View style={{ gap: 8, marginBottom: bottom === 0 ? 16 : 0 }}>
          <SquircleButton
            activeOpacity={0.8}
            style={[
              styles.footerButton,
              activeIndex === 1 && !selectedGoal && styles.footerButtonDisabled,
              (activeIndex === 0 || activeIndex === 2) && styles.footerButtonActive0,
            ]}
            onPress={handleNext}
            disabled={activeIndex === 1 && !selectedGoal}>
            {activeIndex === 0 ? (
              <Text style={[styles.footerContinueText, styles.footerButtonActive0Text]}>
                {t("onboarding.continue1")}
              </Text>
            ) : activeIndex === 1 ? (
              <Text
                style={[
                  styles.footerContinueText,
                  !selectedGoal && styles.footerContinueTextDisabled,
                ]}>
                {t("onboarding.continue2")}
              </Text>
            ) : activeIndex >= 2 ? (
              <Text style={[styles.footerContinueText, styles.footerButtonActive0Text]}>
                {t("onboarding.startFirstSession")}
              </Text>
            ) : null}
          </SquircleButton>

          <SquircleButton
            borderRadius={12}
            style={{ backgroundColor: "transparent", padding: 16, marginHorizontal: 16 }}
            onPress={() => router.navigate("/(auth)")}>
            <Text style={styles.footerAlreadyHaveAccountText} numberOfLines={1}>
              {t("onboarding.alreadyHaveAccount")}
            </Text>
          </SquircleButton>
        </View>
      </SafeAreaView>
    </SignedOut>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.grayBackground },
  footerButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.slate200,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 0.2,
    elevation: 2,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerButtonDisabled: { opacity: 0.5 },
  footerContinueText: { textAlign: "center", color: Colors.primary700, ...defaultStyles.textBold },
  footerContinueTextDisabled: { color: Colors.slate500 },
  footerAlreadyHaveAccountText: { textAlign: "center", color: Colors.dark },
  footerButtonActive0: { backgroundColor: Colors.primary700, borderColor: Colors.primary700 },
  footerButtonActive0Text: { color: Colors.background },
});
