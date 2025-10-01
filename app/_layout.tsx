import ClerkProviderWrapper from "@/libs/clerk-provider-wrapper";
import { useAuth } from "@clerk/clerk-expo";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

export const unstable_settings = { anchor: "(tabs)" };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const InitialLayout = () => {
  const router = useRouter();

  const [appIsReady, setAppIsReady] = useState(false);
  const { isSignedIn, isLoaded, userId } = useAuth();

  useEffect(() => {
    async function prepare() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        router.navigate("/(auth)");
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
    return <Text>Loading...</Text>;
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
    <ClerkProviderWrapper>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <SystemBars style="auto" />
          <InitialLayout />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProviderWrapper>
  );
}
