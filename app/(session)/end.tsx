import { EndSessionModal } from "@/components/(session)/end-session-modal";
import { StreakCard } from "@/components/streak-card";
import { useTranslation } from "@/hooks/use-translation";
import * as schema from "@/libs/drizzle/schema";
import { Session } from "@/libs/drizzle/schema";
import { useInSessionStore } from "@/libs/zustand/in-session-store";
import {
  completeSession,
  getCurrentStreak,
  getSessionById,
  updateSessionFavorite,
  updateSessionTitle,
} from "@/services/session-service";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { generateSessionTitle } from "@/utils/generate-session-title";
import { formatDuration } from "@/utils/time";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { SquircleButton, SquircleView } from "expo-squircle-view";
import React, { useEffect, useState } from "react";
import { ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { userId } = useAuth();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [placeholderTitle, setPlaceholderTitle] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const { sessionId, clearSession } = useInSessionStore();

  // Fetch session details and register completion immediately
  useEffect(() => {
    const initSessionPage = async () => {
      if (!sessionId || !userId) return;

      try {
        const fetchedSession = await getSessionById(drizzleDb, sessionId);

        if (fetchedSession) {
          setSession(fetchedSession);

          const defaultTitle = generateSessionTitle({
            totalDuration: fetchedSession.totalDuration,
            numberOfExercices: fetchedSession.numberOfExercices,
            exerciseDuration: fetchedSession.exerciseDuration,
          });

          setPlaceholderTitle(defaultTitle);

          // Register session as completed immediately if not already done
          if (!fetchedSession.completedAt) {
            await completeSession(drizzleDb, sessionId, defaultTitle);
          }

          // Fetch current streak after ensuring session is completed
          const streak = await getCurrentStreak(drizzleDb, userId);
          setCurrentStreak(streak);
        }
      } catch (error) {
        console.error("Failed to init session page:", error);
      }
    };

    initSessionPage();
  }, [sessionId, userId]);

  const handleFinishButton = async () => {
    if (!sessionId || isCompleting) return;

    try {
      setIsCompleting(true);

      // Update title only if user provided a custom one
      const finalTitle = sessionTitle.trim();

      if (finalTitle && finalTitle !== placeholderTitle) {
        await updateSessionTitle(drizzleDb, sessionId, finalTitle);
      }

      clearSession();
      router.replace("/(_tabs)");
    } catch (error) {
      console.error("Failed to finish session:", error);
      setIsCompleting(false);
    }
  };

  const handleShare = async () => {
    if (!session) return;

    const exercisesList = session.exercices.map((e) => `- ${e.title}`).join("\n");

    const message = [
      t("session.sessionCompleted"),
      `${t("session.totalDuration")}: ${formatDuration(session.totalDuration)}`,
      `${t("session.numberOfExercises")}: ${session.numberOfExercices}`,
      "",
      t("session.exercises") + ":",
      exercisesList,
    ].join("\n");

    try {
      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleFavorite = async () => {
    if (!session || !sessionId) return;

    try {
      await updateSessionFavorite(drizzleDb, sessionId, !session.favorite);
      setSession({ ...session, favorite: session.favorite ? 0 : 1 });
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const totalPause = session ? (session.numberOfExercices - 1) * session.pauseDuration : 0;

  return (
    <SafeAreaView style={styles.container}>
      <EndSessionModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <Text style={styles.title}>{t("session.sessionCompleted")}</Text>

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
            label={t("session.numberOfExercises")}
            value={session ? `${session.numberOfExercices} exercices` : "..."}
            icon={"barbell-outline"}
            color={Colors.blue500}
            bg={Colors.blue50}
          />
          <Block
            label={t("session.totalDuration")}
            value={session ? formatDuration(session.totalDuration) : "..."}
            icon={"time-outline"}
            color={Colors.blue500}
            bg={Colors.blue50}
          />
          <Block
            label={t("session.totalPause")}
            value={session ? formatDuration(totalPause) : "..."}
            icon={"hourglass-outline"}
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
            borderRadius={16}
            onPress={handleFavorite}
            style={[styles.secondaryActionButton, styles.favoriteButton]}>
            <Text
              style={[styles.secondaryActionButtonText, { color: Colors.primary700 }]}
              numberOfLines={1}>
              {t("session.addToFavorites")}
            </Text>
            <Ionicons
              name={session?.favorite ? "heart" : "heart-outline"}
              size={24}
              color={Colors.primary700}
            />
          </SquircleButton>

          <SquircleButton
            activeOpacity={0.8}
            borderRadius={16}
            onPress={handleShare}
            style={[styles.secondaryActionButton, styles.shareButton]}>
            <Text
              style={[styles.secondaryActionButtonText, { color: Colors.slate500 }]}
              numberOfLines={1}>
              {t("session.share")}
            </Text>
            <Ionicons name="share-outline" size={24} color={Colors.slate500} />
          </SquircleButton>
        </View>

        <StreakCard streak={currentStreak} />
      </ScrollView>

      <View style={styles.stickyButtonContainer}>
        <SquircleButton
          activeOpacity={0.8}
          borderRadius={12}
          onPress={handleFinishButton}
          disabled={isCompleting}
          style={[styles.completeButton, { opacity: isCompleting ? 0.5 : 1 }]}>
          <Text style={styles.completeButtonText}>
            {isCompleting ? t("session.saving") : t("session.finishSession")}
          </Text>
        </SquircleButton>
      </View>
    </SafeAreaView>
  );
}

interface BlockProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
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
  },
  titleInput: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.dark,
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
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  secondaryActionButton: {
    flex: 1,
    height: 56,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  favoriteButton: {
    backgroundColor: Colors.primary50,
    borderColor: Colors.primary200,
  },
  shareButton: {
    backgroundColor: Colors.slate50,
    borderColor: Colors.slate200,
  },
  secondaryActionButtonText: { fontWeight: "500" },
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
  },
});
