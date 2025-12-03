import { SquircleButton } from "expo-squircle-view";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTranslation } from "@/hooks/use-translation";
import { Language } from "@/libs/zustand/app-preference-store";
import { Colors } from "@/utils/constants/colors";

interface LanguageConfig {
  code: Language;
  label: string;
  flag: string;
}

/**
 * Language selector component - Example usage of the translation system
 */
export const LanguageSelector = () => {
  const { t, language, setLanguage } = useTranslation();

  const languages: LanguageConfig[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <SquircleButton
          key={lang.code}
          style={[styles.button, language === lang.code && styles.activeButton]}
          onPress={() => setLanguage(lang.code, true)}
          activeOpacity={0.8}>
          <Text>{lang.flag}</Text>
          <Text style={[styles.buttonText, language === lang.code && styles.activeButtonText]}>
            {lang.label}
          </Text>
        </SquircleButton>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 16 },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderColor: Colors.slate200,
  },
  activeButton: { backgroundColor: Colors.primary50, borderColor: Colors.primary700 },
  buttonText: { fontWeight: "500", color: Colors.dark },
  activeButtonText: { color: Colors.primary700 },
});
