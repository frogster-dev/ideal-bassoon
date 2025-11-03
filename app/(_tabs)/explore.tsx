import { Header } from "@/components/ui/header";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { SquircleButton } from "expo-squircle-view";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const { userId, signOut } = useAuth();
  const { top } = useSafeAreaInsets();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const handleLogout = () => {
    setLogoutLoading(true);
    signOut();
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <Header />

      {/* Logout Section */}
      <SquircleButton
        borderRadius={12}
        style={styles.logoutButton}
        disabled={logoutLoading}
        onPress={handleLogout}>
        <Text style={styles.dangerButtonText}>Se déconnecter</Text>
        {logoutLoading ? (
          <ActivityIndicator size="small" color={Colors.red500} />
        ) : (
          <Ionicons name="log-out-outline" size={22} color={Colors.red500} />
        )}
      </SquircleButton>
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
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  dangerButtonText: {
    color: Colors.red500,
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
  },
  logoutButton: {
    height: 48,
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.red50,
    justifyContent: "center",
    alignItems: "center",
  },
});
