import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";

export default function Page() {
  const router = useRouter();

  const handleRedirect = () => {
    router.navigate("/");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={{ color: Colors.dark }}>Oups... Page introuvable</Text>

        <TouchableOpacity onPress={handleRedirect} style={styles.redirectButton}>
          <Ionicons name="arrow-back-outline" size={24} color={Colors.background} />

          <Text style={[defaultStyles.textBold, { color: Colors.background }]}>
            Retourner à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1, backgroundColor: Colors.primary700 },
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 32 },
  redirectButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary700,
    padding: 12,
    paddingHorizontal: 16,
    shadowColor: Colors.dark,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 1.51,
    elevation: 2,
  },
});
