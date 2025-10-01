import { ActivityIndicator, StyleSheet, Text } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SquircleButton } from "expo-squircle-view";
import { useState } from "react";

export default function TabTwoScreen() {
  const { signOut } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    setLogoutLoading(true);
    signOut();
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <MaterialCommunityIcons
          name="account-box-outline"
          size={310}
          color={Colors.primary700}
          style={styles.headerImage}
        />
      }>
      <SquircleButton
        borderRadius={12}
        style={styles.dangerButton}
        disabled={logoutLoading}
        onPress={handleLogout}>
        <Text style={styles.dangerButtonText}>{"Se déconnecter"}</Text>
        {logoutLoading ? (
          <ActivityIndicator size="small" color={Colors.red500} />
        ) : (
          <Ionicons name="log-out-outline" size={22} color={Colors.red500} />
        )}
      </SquircleButton>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dangerButton: {
    height: 48,
    backgroundColor: Colors.background,
    padding: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  dangerButtonText: { color: Colors.red500, ...defaultStyles.textBold, flex: 1 },
});
