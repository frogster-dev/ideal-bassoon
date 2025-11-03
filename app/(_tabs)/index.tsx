import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { ActivityCalendar } from "@/components/activity-calendar";
import { SessionCard } from "@/components/session-card";
import { SessionCardPlaceholder } from "@/components/session-card-placeholder";
import { StatsCard } from "@/components/stats-card";
import { FirstTimeChallenge } from "@/components/ui/first-time-challenge";
import { Header } from "@/components/ui/header";
import type { Session } from "@/libs/drizzle/schema";
import * as schema from "@/libs/drizzle/schema";
import { UserSessionStats, getUserSessionStats, getUserSessions } from "@/services/session-service";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { formatEffortDurationTime } from "@/utils/session";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface DayActivity {
  date: string; // YYYY-MM-DD
  sessionsCount: number;
  totalDuration: number;
}

export default function ExploreScreen() {
  const { userId } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const [stats, setStats] = useState<UserSessionStats | null>(null);
  const [activities, setActivities] = useState<DayActivity[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(0);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const fetchData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch stats
      const userStats = await getUserSessionStats(drizzleDb, userId);

      setStats(userStats);

      // Process activities by day
      const activitiesMap = new Map<string, DayActivity>();
      // Fetch all completed sessions just for activity aggregation
      const allSessionsForActivities = await getUserSessions(drizzleDb, userId, false);
      allSessionsForActivities.forEach((session) => {
        if (session.completedAt) {
          const dateString = new Date(session.completedAt).toISOString().split("T")[0];
          const existing = activitiesMap.get(dateString);

          if (existing) {
            existing.sessionsCount++;
            existing.totalDuration += session.totalDuration;
          } else {
            activitiesMap.set(dateString, {
              date: dateString,
              sessionsCount: 1,
              totalDuration: session.totalDuration,
            });
          }
        }
      });

      setActivities(Array.from(activitiesMap.values()));

      // Load first page of sessions for list
      const firstPage = await getUserSessions(drizzleDb, userId, false, PAGE_SIZE, 0);
      setSessions(firstPage);
      setHasMore(firstPage.length === PAGE_SIZE);
      setPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    // Reset pagination state before refetch
    setSessions([]);
    setHasMore(true);
    setPage(0);
    fetchData();
  };

  const loadMore = async () => {
    if (loading || isLoadingMore || !hasMore || !userId) return;
    try {
      setIsLoadingMore(true);
      const nextOffset = page * PAGE_SIZE;
      const nextPage = await getUserSessions(drizzleDb, userId, false, PAGE_SIZE, nextOffset);
      setSessions((prev) => [...prev, ...nextPage]);
      setHasMore(nextPage.length === PAGE_SIZE);
      setPage((p) => p + 1);
    } catch (e) {
      console.error("Error loading more sessions:", e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const HeaderComponent = () => {
    if (!loading && sessions.length === 0) {
      return (
        <View>
          <FirstTimeChallenge />

          <Text style={[styles.title, { opacity: 0.5, marginVertical: 16 }]}>
            Vos séances apparaitront ici
          </Text>
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <SessionCardPlaceholder
              title="Ma séance avant le travail"
              date="today"
              numberOfExercices={10}
              totalDuration={850}
              difficulty={2}
            />
            <SessionCardPlaceholder
              title="Longue séance après une journée de m**** "
              date="yesterday"
              numberOfExercices={22}
              totalDuration={1300}
              difficulty={1}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.headerContent}>
        {/* Stats Grid */}
        {stats ? (
          <View style={styles.statsGrid}>
            <StatsCard
              icon="checkmark-done"
              iconColor={Colors.primary700}
              iconBackgroundColor={Colors.primary50}
              value={stats.totalSessions}
              label="Sessions"
              subtitle="complétées"
            />
            <StatsCard
              icon="barbell"
              iconColor={Colors.orange500}
              iconBackgroundColor={Colors.orange50}
              value={stats.totalExercices}
              label="Exercices"
              subtitle="réalisés"
            />
            <StatsCard
              icon="analytics"
              iconColor={Colors.green500}
              iconBackgroundColor={Colors.green50}
              value={formatEffortDurationTime(stats.totalEffortDuration)[0]}
              label={formatEffortDurationTime(stats.totalEffortDuration)[1]}
              subtitle="d'étirement"
            />
          </View>
        ) : (
          <Text>@todo: un placeholder</Text>
        )}

        {/* Activity Calendar */}
        <ActivityCalendar activities={activities} />
        {/* Title for sessions list */}
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <Text style={styles.title}>Mes dernières sessions</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView edges={["left", "right"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary700} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      {/* Header */}
      <Header />

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SessionCard item={item} />}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={null}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary700}
          />
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator size="small" color={Colors.primary700} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    ...defaultStyles.textL,
    color: Colors.slate500,
  },
  greeting: { color: Colors.background },
  userName: {
    ...defaultStyles.textXL,
    ...defaultStyles.textBold,
    color: Colors.background,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  infoSection: {
    marginBottom: 24,
  },
  logoutSection: {
    marginTop: 8,
  },
  title: {
    ...defaultStyles.textL,
    textAlign: "center",
    ...defaultStyles.textBold,
    color: Colors.primary700,
    marginHorizontal: 16,
  },
});
