import React, { useRef, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { FirstStep } from "@/components/(onboarding)/first-step";
import { SecondStep } from "@/components/(onboarding)/second-step";
import { ThirdStep } from "@/components/(onboarding)/third-step";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { useRouter } from "expo-router";
import { SquircleButton } from "expo-squircle-view";

const CarouselItems = [
  <FirstStep key="first-step" />,
  <SecondStep key="second-step" />,
  <ThirdStep key="third-step" />,
];

export default function Page() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const carouselRef = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex === CarouselItems.length - 1) {
      router.navigate("/(auth)");
    } else {
      carouselRef.current?.scrollTo({ index: activeIndex + 1, animated: true });
      setActiveIndex((prev) => prev + 1);
    }
  };

  return (
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
        />
      </View>

      <View style={{ gap: 8, marginBottom: bottom === 0 ? 16 : 0 }}>
        <SquircleButton
          activeOpacity={0.6}
          borderRadius={12}
          style={styles.footerButton}
          onPress={handleNext}>
          {activeIndex === 0 ? (
            <Text style={styles.footerContinueText}>Continuer (1/3)</Text>
          ) : activeIndex === 1 ? (
            <Text style={styles.footerContinueText}>Continuer (2/3)</Text>
          ) : activeIndex >= 2 ? (
            <Text style={styles.footerContinueText}>Commencer</Text>
          ) : null}
        </SquircleButton>

        <SquircleButton
          borderRadius={12}
          style={{ backgroundColor: "transparent", padding: 16, marginHorizontal: 16 }}
          onPress={() => router.navigate("/(auth)")}>
          <Text
            style={[defaultStyles.textBold, { color: Colors.dark, textAlign: "center" }]}
            numberOfLines={1}>
            J'ai déjà un compte. Me connecter
          </Text>
        </SquircleButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.grayBackground },
  footerButton: {
    backgroundColor: Colors.background,
    padding: 16,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerContinueText: {
    textAlign: "center",
    color: Colors.primary700,
    ...defaultStyles.textBold,
  },
});
