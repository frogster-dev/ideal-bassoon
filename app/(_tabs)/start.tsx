import { useRouter } from "expo-router";
import { SquircleButton } from "expo-squircle-view";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/utils/constants/colors";

export default function Page() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Page de configuration de la seance d'etirement</Text>
      <SquircleButton style={styles.button} onPress={() => router.replace("/(session)")}>
        <Text>Commencer la séance</Text>
      </SquircleButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.grayBackground },
  button: {
    color: Colors.primary700,
    padding: 16,
    height: 50,
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 10,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
