import { useTranslation } from "@/hooks/use-translation";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

export const FirstStep = () => {
  const { t } = useTranslation();

  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.imageContainer, { width: width * 0.4, height: width * 0.4 }]}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.image}
            contentFit="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("onboarding.title1")}</Text>
          <Text style={styles.subtitle}>{t("onboarding.subtitle1")}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.grayBackground, paddingHorizontal: 24 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", gap: 48 },
  imageContainer: {
    backgroundColor: Colors.background,
    borderRadius: 100,
    alignSelf: "center",
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0.2,
    elevation: 4,
  },
  image: { width: "100%", height: "100%", borderRadius: 100 },
  textContainer: { gap: 16, paddingHorizontal: 16 },
  title: {
    ...defaultStyles.textXL,
    ...defaultStyles.textBold,
    color: Colors.primary700,
    textAlign: "center",
  },
  subtitle: { color: Colors.dark, textAlign: "center" },
});
