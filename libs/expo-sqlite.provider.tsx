import migrations from "@/libs/drizzle/migrations/migrations";
import { DATABASE_NAME } from "@/utils/database";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { seedExercises } from "./drizzle/database/seed-exercises";

export const ExpoSqliteProvider = ({ children }: PropsWithChildren) => {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  const [isSeeded, setIsSeeded] = useState(false);

  useEffect(() => {
    // Seed exercises after migrations are complete
    if (success) {
      console.log("Seeding exercises");
      seedExercises()
        .then(() => {
          console.log("✅ Database seeding complete");
          setIsSeeded(true);
        })
        .catch((err) => {
          console.error("❌ Error during seeding:", err);
          setIsSeeded(true); // Continue anyway
        });
    } else {
      console.log("Migrations failed");
    }
  }, [success]);

  // Show loading while migrations and seeding are in progress
  if (!success || !isSeeded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Initializing database...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense>
        {children}
      </SQLiteProvider>
    </Suspense>
  );
};
