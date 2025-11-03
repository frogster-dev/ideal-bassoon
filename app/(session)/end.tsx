import { EndSessionModal } from "@/components/(session)/end-session-modal";
import { StreakCard } from "@/components/streak-card";
import * as schema from "@/libs/drizzle/schema";
import { useInSessionStore } from "@/libs/zustand/in-session-store";
import { completeSession, getSessionById } from "@/services/session-service";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { generateSessionTitle } from "@/utils/generate-session-title";
import { Ionicons } from "@expo/vector-icons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { SquircleButton, SquircleView } from "expo-squircle-view";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [modalVisible, setModalVisible] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [placeholderTitle, setPlaceholderTitle] = useState("");

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const { sessionId, clearSession } = useInSessionStore();

  // Générer un titre placeholder basé sur la session actuelle
  useEffect(() => {
    const generatePlaceholder = async () => {
      if (!sessionId) return;

      try {
        const session = await getSessionById(drizzleDb, sessionId);

        if (session) {
          setPlaceholderTitle(
            generateSessionTitle({
              totalDuration: session.totalDuration,
              numberOfExercices: session.numberOfExercices,
              exerciseDuration: session.exerciseDuration,
            }),
          );
        }
      } catch (error) {
        console.error("Failed to generate placeholder:", error);
      }
    };

    generatePlaceholder();
  }, [sessionId]);

  const handleCompleteSession = async () => {
    if (!sessionId || isCompleting) return;

    try {
      setIsCompleting(true);

      // Générer un titre automatique si l'utilisateur n'en a pas fourni
      let finalTitle = sessionTitle.trim();

      if (!finalTitle) {
        // Récupérer la session pour obtenir sa configuration
        const session = await getSessionById(drizzleDb, sessionId);
        if (session) {
          finalTitle = generateSessionTitle({
            totalDuration: session.totalDuration,
            numberOfExercices: session.numberOfExercices,
            exerciseDuration: session.exerciseDuration,
          });
        }
      }

      await completeSession(drizzleDb, sessionId, finalTitle);
      clearSession();
      router.replace("/explore");
    } catch (error) {
      console.error("Failed to complete session:", error);
      setIsCompleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <EndSessionModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <Text style={styles.title}>Séance terminée</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.titleInput}
          placeholder={placeholderTitle}
          value={sessionTitle}
          onChangeText={setSessionTitle}
          maxLength={100}
          autoCapitalize="sentences"
        />

        <View style={styles.blocks}>
          <Block
            label="Nombre d'exercices"
            value={"4 exercices"}
            icon={"pause-circle-outline"}
            color={Colors.blue500}
            bg={Colors.blue50}
          />
          <Block
            label="Durée totale de la séance"
            value="4 min 00"
            icon={"pause-circle-outline"}
            color={Colors.blue500}
            bg={Colors.blue50}
          />
          <Block
            label="Total pause"
            value="4 min 00"
            icon={"pause-circle-outline"}
            color={Colors.blue500}
            bg={Colors.blue50}
          />
        </View>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Ionicons name="star" size={24} color="#FFD700" style={styles.star} />
          <Ionicons name="star" size={24} color="#FFD700" style={styles.star} />
          <Ionicons name="star" size={24} color="#FFD700" style={styles.star} />
          <View style={styles.separator} />
        </View>

        <View style={styles.secondaryActionsContainer}>
          <SquircleButton
            activeOpacity={0.8}
            borderRadius={8}
            onPress={() => router.replace("/start")}
            style={styles.secondaryActionButton}>
            <Text style={styles.secondaryActionButtonText}>Ajouter favoris</Text>
            <Ionicons name="bookmark-outline" size={24} color={Colors.background} />
          </SquircleButton>

          <SquircleButton
            activeOpacity={0.8}
            borderRadius={8}
            onPress={() => router.replace("/start")}
            style={[styles.secondaryActionButton, { backgroundColor: Colors.slate500 }]}>
            <Text style={styles.secondaryActionButtonText}>Partager</Text>
            <Ionicons name="share-outline" size={24} color={Colors.background} />
          </SquircleButton>
        </View>

        <StreakCard />
      </ScrollView>

      <View style={styles.stickyButtonContainer}>
        <SquircleButton
          activeOpacity={0.8}
          borderRadius={12}
          onPress={handleCompleteSession}
          disabled={isCompleting}
          style={[styles.completeButton, { opacity: isCompleting ? 0.5 : 1 }]}>
          <Text style={styles.completeButtonText}>
            {isCompleting ? "Enregistrement..." : "Terminer la séance"}
          </Text>
        </SquircleButton>
      </View>
    </SafeAreaView>
  );
}

interface BlockProps {
  label: string;
  value: string;
  icon: typeof Ionicons.defaultProps;
  color: string;
  bg: string;
}

const Block = ({ label, value, icon, color, bg }: BlockProps) => {
  return (
    <SquircleView style={styles.block} borderRadius={10}>
      <View style={{ padding: 6, backgroundColor: bg, borderRadius: 99 }}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={{ gap: 4, flex: 1 }}>
        <Text style={styles.blockTitle}>{label}</Text>
        <Text style={styles.blockNumber}>{value}</Text>
      </View>
    </SquircleView>
  );
};

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 208 },
  container: { flex: 1, backgroundColor: Colors.grayBackground },
  title: {
    paddingTop: 16,
    color: Colors.dark,
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
    textAlign: "center",
  },
  titleInputContainer: {
    marginTop: 24,
    gap: 8,
  },
  titleInputLabel: {
    color: Colors.dark,
    ...defaultStyles.textBold,
    fontSize: 14,
  },
  titleInput: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.dark,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  titleInputHint: {
    color: Colors.dark,
    ...defaultStyles.textS,
    opacity: 0.6,
  },
  blocks: { gap: 16, marginTop: 32 },
  block: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.background,
    gap: 12,
  },
  blockTitle: {
    color: Colors.dark,
    textTransform: "uppercase",
    opacity: 0.6,
    ...defaultStyles.textS,
  },
  blockNumber: { color: Colors.dark },
  separatorContainer: {
    marginVertical: 32,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.slate200,
  },
  star: { opacity: 0.5 },
  secondaryActionsContainer: {
    flexDirection: "row",
    gap: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
  secondaryActionButton: {
    flex: 1,
    height: 48,
    gap: 8,
    backgroundColor: Colors.primary700,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionButtonText: {
    color: Colors.background,
    ...defaultStyles.textBold,
  },
  stickyButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 32,
    padding: 16,
  },
  completeButton: {
    backgroundColor: Colors.primary700,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonText: {
    color: Colors.background,
    ...defaultStyles.textBold,
    fontSize: 16,
  },
});
