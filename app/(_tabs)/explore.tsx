import { LanguageSelector } from "@/components/language-selector";
import { Header } from "@/components/ui/header";
import { usePremiumBottomSheet } from "@/hooks/use-premium-bottom-sheet";
import { useTranslation } from "@/hooks/use-translation";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { SquircleButton } from "expo-squircle-view";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { openPremiumSheet } = usePremiumBottomSheet();

  const isPremium = false;

  const handleLogout = () => {
    setLogoutLoading(true);
    signOut();
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <Header />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isPremium ? t("settings.yourePremium") : t("settings.goPremium")}
          </Text>
          <SquircleButton
            borderRadius={12}
            style={[styles.premiumButton, !isPremium && styles.nonPremiumButton]}
            disabled={logoutLoading}
            onPress={openPremiumSheet}>
            <Text style={[styles.premiumButtonText, !isPremium && styles.nonPremiumButtonText]}>
              {isPremium ? t("settings.handleremiumSubscription") : t("settings.goPremium")}
            </Text>
          </SquircleButton>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.language", "Language")}</Text>
          <LanguageSelector />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.account", "Account")}</Text>
          <SquircleButton
            borderRadius={12}
            style={styles.logoutButton}
            disabled={logoutLoading}
            onPress={handleLogout}>
            <Text style={styles.dangerButtonText}>{t("settings.logout")}</Text>
            {logoutLoading ? (
              <ActivityIndicator size="small" color={Colors.red500} />
            ) : (
              <Ionicons name="log-out-outline" size={22} color={Colors.red500} />
            )}
          </SquircleButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  greeting: { color: Colors.background },
  userName: {
    ...defaultStyles.textXL,
    ...defaultStyles.textBold,
    color: Colors.background,
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.grayBackground,
  },
  content: {
    paddingTop: 32,
    padding: 16,
    paddingBottom: 208,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  languageSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  sectionTitle: {
    ...defaultStyles.textBold,
    color: Colors.dark,
    opacity: 0.7,
  },
  dangerButtonText: {
    color: Colors.red500,
    flex: 1,
    ...defaultStyles.textBold,
  },
  logoutButton: {
    height: 48,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.red50,
    borderWidth: 1,
    borderColor: Colors.red500,
    alignItems: "center",
  },
  premiumButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    borderColor: Colors.slate200,
  },
  nonPremiumButton: {
    backgroundColor: Colors.primary500,
    borderColor: Colors.primary500,
  },
  premiumButtonText: {
    color: Colors.primary500,
    ...defaultStyles.textBold,
  },
  nonPremiumButtonText: {
    color: Colors.background,
    ...defaultStyles.textBold,
  },
});
