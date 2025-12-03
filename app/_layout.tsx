import { useTranslation } from "@/hooks/use-translation";
import ClerkProviderWrapper from "@/libs/clerk-provider-wrapper";
import { ExpoSqliteProvider } from "@/libs/expo-sqlite.provider";
import { Language, useAppPreferences } from "@/libs/zustand/app-preference-store";
import { PremiumBottomSheetProvider } from "@/providers/premium-bottom-sheet-provider";
import { useAuth } from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { getLocales } from "expo-localization";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

export const unstable_settings = { anchor: "(_tabs)" };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const InitialLayout = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [appIsReady, setAppIsReady] = useState(false);
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { hasManuallySelectedLanguage, setLanguage } = useAppPreferences();

  // Detect and set device language on first launch
  useEffect(() => {
    if (!hasManuallySelectedLanguage) {
      const locales = getLocales();
      const deviceLanguage = locales[0]?.languageCode;

      // Map device language to supported languages
      let detectedLanguage: Language = "en"; // default
      if (deviceLanguage === "fr") {
        detectedLanguage = "fr";
      }

      setLanguage(detectedLanguage, false); // false = not manual selection
    }
  }, [hasManuallySelectedLanguage]);

  useEffect(() => {
    console.log("InitialLayout");
  }, []);

  useEffect(() => {
    console.log("isLoaded", isLoaded, "isSignedIn", isSignedIn, "userId", userId);
    async function prepare() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        router.navigate("/");
        setAppIsReady(true);
      }

      if (isSignedIn && userId) {
        router.navigate("/(_tabs)");
        setAppIsReady(true);
      }
    }

    prepare();
  }, [isSignedIn, userId, isLoaded]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!isLoaded) {
    return <Text>{t("common.loading")}</Text>;
  }

  return (
    <Stack screenOptions={{ statusBarTranslucent: true, headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(_tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(session)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ExpoSqliteProvider>
      <ClerkProviderWrapper>
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <PremiumBottomSheetProvider>
                <SystemBars style="auto" />
                <InitialLayout />
              </PremiumBottomSheetProvider>
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ClerkProviderWrapper>
    </ExpoSqliteProvider>
  );
}
