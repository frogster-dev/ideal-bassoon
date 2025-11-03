import { Colors } from "@/utils/constants/colors";
import { effortDurationOptions } from "@/utils/constants/session";
import { defaultStyles } from "@/utils/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { SquircleView } from "expo-squircle-view";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface DayActivity {
  date: string; // YYYY-MM-DD
  sessionsCount: number;
  totalDuration: number; // in seconds
}

interface ActivityCalendarProps {
  activities: DayActivity[];
}

interface ActivityCalendarDay {
  date: Date;
  dateString: string;
  activity: DayActivity | null;
  isFuture: boolean;
}

export const ActivityCalendar = ({ activities }: ActivityCalendarProps) => {
  // Get the last 7 weeks (49 days) for the calendar
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Create a map for quick lookup
  const activityMap = new Map(activities.map((activity) => [activity.date, activity]));

  // Calculate the start date (Monday of 7 weeks ago)
  const startDate = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days since last Monday
  startDate.setDate(startDate.getDate() - daysToMonday - 6 * 7); // Go back to Monday of 7 weeks ago

  // Generate 7 weeks (49 days) starting from that Monday
  const [calendarDays, calendarWeeks] = useMemo(() => {
    const days: ActivityCalendarDay[] = [];

    for (let i = 0; i < 49; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split("T")[0];

      // If same day, do not consider as future
      const isFuture = date > today;

      days.push({
        date,
        dateString,
        activity: activityMap.get(dateString) || null,
        isFuture,
      });
    }

    // Group by weeks (7 days each)
    const weeks: ActivityCalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return [days, weeks];
  }, [activities]);

  // Calculate current and longest streak
  const [currentStreak, longestStreak, streakDays, lastStreakDay] = useMemo(() => {
    // Calculate current streak (only count up to today)
    let current = 0;
    const streakDateStrings: string[] = [];
    let lastStreakDateString: string | null = null;

    for (let i = calendarDays.length - 1; i >= 0; i--) {
      if (calendarDays[i].isFuture) continue; // Skip future days
      if (calendarDays[i].activity) {
        current++;
        streakDateStrings.push(calendarDays[i].dateString);
        if (lastStreakDateString === null) {
          lastStreakDateString = calendarDays[i].dateString; // First one we find (going backwards) is the last day
        }
      } else {
        break;
      }
    }

    // Calculate longest streak (only count up to today)
    let longest = 0;
    let tmp = 0;
    for (const day of calendarDays) {
      if (day.isFuture) continue; // Skip future days
      if (day.activity) {
        tmp++;
        longest = Math.max(longest, tmp);
      } else {
        tmp = 0;
      }
    }

    return [current, longest, new Set(streakDateStrings), lastStreakDateString];
  }, [calendarDays]);

  const getIntensityColor = (totalDuration: number) => {
    // Based on production effortDurationOptions: 10min, 15min, 20min, 25min
    // totalDuration is in seconds
    if (totalDuration === 0) return Colors.slate200; // No activity
    if (totalDuration < effortDurationOptions[0].value) return Colors.primary50; // Less than 15 minutes
    if (totalDuration < effortDurationOptions[1].value) return Colors.primary200; // 15-20 minutes
    if (totalDuration < effortDurationOptions[2].value) return Colors.primary500; // 20-25 minutes
    if (totalDuration < effortDurationOptions[3].value) return Colors.primary700; // 25+ minutes
  };

  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <SquircleView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Activité des 7 dernières semaines</Text>

      {/* Streak Info */}
      <View style={styles.streakContainer}>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>Série actuelle</Text>
          <View style={styles.streakIconContainer}>
            <Ionicons name="flame" size={40} color={Colors.orange500} />
            <View style={styles.valueContainer}>
              <Text style={[styles.streakValue, { color: Colors.orange500 }]}>{currentStreak}</Text>
            </View>
          </View>
        </View>

        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>Record</Text>
          <View style={styles.streakIconContainer}>
            <Ionicons name="trophy" size={40} color={Colors.yellow500} />
            <View style={styles.valueContainer}>
              <Text style={[styles.streakValue, { color: Colors.yellow500 }]}>{longestStreak}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        {/* Day labels - Horizontal */}
        <View style={styles.dayLabelsRow}>
          {dayLabels.map((label, index) => (
            <View key={index} style={styles.dayLabelContainer}>
              <Text style={styles.dayLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Weeks - Vertical Stack */}
        <View style={styles.weeksContainer}>
          {calendarWeeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => {
                const isToday = day.dateString === todayString;
                const totalDuration = day.activity?.totalDuration || 0;
                const isInStreak = streakDays.has(day.dateString);
                const isLastStreakDay = day.dateString === lastStreakDay;

                return (
                  <SquircleView
                    key={dayIndex}
                    style={[
                      styles.day,
                      {
                        backgroundColor: getIntensityColor(totalDuration),
                        opacity: day.isFuture ? 0.4 : 1,
                      },
                      isToday && styles.dayToday,
                      isInStreak && !isLastStreakDay && styles.dayInStreak,
                      isLastStreakDay && styles.dayLastStreak,
                    ]}>
                    {totalDuration > 0 && !day.isFuture && (
                      <View style={styles.dayBadge}>
                        <View style={styles.dayBadgeTextContainer}>
                          <Text style={styles.dayBadgeText}>{Math.floor(totalDuration / 60)}</Text>
                        </View>
                      </View>
                    )}
                  </SquircleView>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.totalDurationText}>Total de minutes chaque jour</Text>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Moins</Text>
        <View style={[styles.legendBox, { backgroundColor: Colors.slate200 }]} />
        <View style={[styles.legendBox, { backgroundColor: Colors.primary50 }]} />
        <View style={[styles.legendBox, { backgroundColor: Colors.primary200 }]} />
        <View style={[styles.legendBox, { backgroundColor: Colors.primary500 }]} />
        <View style={[styles.legendBox, { backgroundColor: Colors.primary700 }]} />
        <Text style={styles.legendText}>Plus</Text>
      </View>

      <View style={styles.line} />

      <Text style={styles.lastText1}>
        Maintenez votre série de jours consécutifs pour développer une habitude durable d'étirement.
      </Text>
      <Text style={styles.lastText}>Chaque session compte!</Text>
    </SquircleView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    marginBottom: 16,
  },
  title: {
    color: Colors.dark,
    textAlign: "center",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
    paddingVertical: 16,
  },
  streakItem: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  line: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: Colors.slate200,
    marginVertical: 16,
  },
  lastText1: { ...defaultStyles.textS, color: Colors.dark, opacity: 0.6 },
  lastText: {
    marginTop: 8,
    ...defaultStyles.textS,
    ...defaultStyles.textBold,
    color: Colors.dark,
    opacity: 0.6,
  },
  valueContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.orange50,
    borderRadius: 99,
    height: 22,
    width: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  streakValue: {
    ...defaultStyles.textBold,
    color: Colors.dark,
  },
  streakLabel: {
    textTransform: "uppercase",
    ...defaultStyles.textS,
    color: Colors.dark,
    opacity: 0.6,
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.slate200,
  },
  calendarContainer: {
    marginBottom: 16,
  },
  dayLabelsRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  dayLabelContainer: {
    flex: 1,
    alignItems: "center",
  },
  dayLabel: {
    ...defaultStyles.textS,
    color: Colors.slate500,
    textAlign: "center",
  },
  weeksContainer: {
    gap: 4,
  },
  week: {
    flexDirection: "row",
    gap: 4,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 32,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dayToday: {
    borderWidth: 2,
    borderColor: Colors.orange500,
  },
  dayInStreak: {
    borderWidth: 2,
    borderColor: Colors.orange200,
  },
  dayLastStreak: {
    borderWidth: 2,
    borderColor: Colors.orange500,
  },
  dayBadge: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  dayBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: Colors.dark,
  },
  dayBadgeTextContainer: {
    borderRadius: 99,
    height: 22,
    width: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  totalDurationText: {
    ...defaultStyles.textS,
    color: Colors.dark,
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  legendText: {
    ...defaultStyles.textS,
    color: Colors.dark,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 99,
  },
});
