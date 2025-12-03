import { useSSO } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { useTranslation } from "@/hooks/use-translation";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
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

  const { width } = useWindowDimensions();

  const { t } = useTranslation();
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
        setError(t("auth.errorIncomplete"));
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
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.imageContainer, { width: width * 0.35, height: width * 0.35 }]}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.image}
              contentFit="cover"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{t("auth.welcomeTitle")}</Text>
            <Text style={styles.subtitle}>{t("auth.welcomeSubtitle")}</Text>
          </View>
        </View>

        <View style={styles.socialsButtons}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <AppleButton onPress={onApplePress} disabled={loading} />
          <GoogleButton onPress={onGoogleSignInPress} disabled={loading} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  content: { flex: 1, justifyContent: "space-between", paddingVertical: 40 },
  header: { alignItems: "center", gap: 40, marginTop: 40 },
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
  textContainer: { gap: 12, paddingHorizontal: 16 },
  title: {
    ...defaultStyles.textXL,
    ...defaultStyles.textBold,
    color: Colors.primary700,
    textAlign: "center",
  },
  subtitle: { color: Colors.dark, textAlign: "center", opacity: 0.7 },
  socialsButtons: { gap: 16, marginBottom: 16 },
  errorText: { color: Colors.red500, textAlign: "center" },
});

export default SocialsAuthentication;
