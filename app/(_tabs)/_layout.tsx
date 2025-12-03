import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useTranslation } from "@/hooks/use-translation";
import { Colors } from "@/utils/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary700,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.home"),
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="start"
          options={{
            title: t("tabs.start"),
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="record-circle" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: t("tabs.explore"),
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-box-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
