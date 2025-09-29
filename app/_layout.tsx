import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
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
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Useless for now but needed for the template
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return (
    <Stack screenOptions={{ statusBarTranslucent: true, headerShown: false }}>
      <Stack.Screen name="(_tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(session)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SystemBars style="auto" />
        <InitialLayout />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
