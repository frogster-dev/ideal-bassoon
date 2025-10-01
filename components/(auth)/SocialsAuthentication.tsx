import { useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/utils/constants/colors";
import { AppleButton } from "./AppleButton";
import { GoogleButton } from "./GoogleButton";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export const SocialsAuthentication = () => {
  useWarmUpBrowser();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { startSSOFlow } = useSSO();

  const onGoogleSignInPress = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { createdSessionId, signUp, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("(auth)", { scheme: "com.frogster.ideal-bassoon" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });

        const isNewUser = signUp?.verifications.emailAddress.status === "verified";
        if (isNewUser) {
          console.log("New Google user signup");
        } else {
          console.log("Existing Google user signin");
        }
      } else {
        setError("Google Sign-In incomplete. Please try again.");
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  }, []);

  const onApplePress = useCallback(async () => {
    try {
      const { createdSessionId, signUp, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
        redirectUrl: Linking.createURL("(auth)", { scheme: "com.frogster.ideal-bassoon" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });

        // Check if this is the first verification for this user
        const isNewUser = signUp?.verifications.emailAddress.status === "verified";
        if (isNewUser) {
          console.log("New Apple user signup");

          // @todo  Maybe it is usefull to Handle initializing
          // handleInitializing?.();
        } else {
          console.log("Existing Apple user signin");
        }
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.socialsButtons}>
        <AppleButton onPress={onApplePress} />

        <GoogleButton onPress={onGoogleSignInPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 32, marginHorizontal: 16, flex: 1 },
  errorText: { color: Colors.red500, textAlign: "center" },
  socialsButtons: { flexDirection: "row", gap: 16, alignItems: "center", flex: 1 },
});

export default SocialsAuthentication;
