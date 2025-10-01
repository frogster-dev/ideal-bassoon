import { useInSessionStore } from "@/libs/zustand/in-session-store";
import { InitializaSessionInput } from "@/utils/interfaces/exercice";
import React from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";

/**
 * Example component showing how to use the fake exercise service
 * with the Zustand store for session management
 */
export const SessionExample: React.FC = () => {
  const {
    exercices,
    isLoading,
    error,
    isPaused,
    initializeSession,
    getCurrentExercice,
    clearSession,
    setPaused,
  } = useInSessionStore();

  const handleStartSession = async () => {
    const sessionInput: InitializaSessionInput = {
      numberOfExercices: 5,
      duration: 30,
      pauseDuration: 10,
      difficulty: 2, // Medium difficulty
    };

    try {
      await initializeSession(sessionInput);
    } catch (error) {
      Alert.alert("Error", "Failed to start session");
    }
  };

  const handleTogglePause = () => {
    setPaused(!isPaused);
  };

  const { current, next } = getCurrentExercice();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading exercises...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "red", marginBottom: 20 }}>Error: {error}</Text>
        <Button title="Retry" onPress={handleStartSession} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Exercise Session</Text>

      {exercices.length === 0 ? (
        <View>
          <Text style={{ marginBottom: 20 }}>
            No session started. Click the button below to begin!
          </Text>
          <Button title="Start Session" onPress={handleStartSession} />
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Session Status: {isPaused ? "Paused" : "Active"}
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 5 }}>Total Exercises: {exercices.length}</Text>

          {current && (
            <View
              style={{
                marginVertical: 20,
                padding: 15,
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
              }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
                Current Exercise:
              </Text>
              <Text style={{ fontSize: 16 }}>ID: {current.id}</Text>
              <Text style={{ fontSize: 16 }}>Title: {current.title}</Text>
              <Text style={{ fontSize: 16 }}>Duration: {current.duration}s</Text>
            </View>
          )}

          {next && (
            <View
              style={{
                marginBottom: 20,
                padding: 15,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
              }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
                Next Exercise:
              </Text>
              <Text style={{ fontSize: 14 }}>ID: {next.id}</Text>
              <Text style={{ fontSize: 14 }}>Title: {next.title}</Text>
              <Text style={{ fontSize: 14 }}>Duration: {next.duration}s</Text>
            </View>
          )}

          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Button title={isPaused ? "Resume" : "Pause"} onPress={handleTogglePause} />
            <Button title="Clear Session" onPress={clearSession} />
          </View>
        </View>
      )}
    </View>
  );
};

export default SessionExample;

