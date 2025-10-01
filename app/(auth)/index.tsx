import SocialsAuthentication from "@/components/(auth)/SocialsAuthentication";
import { Colors } from "@/utils/constants/colors";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.grayBackground }}>
      <SocialsAuthentication />
    </SafeAreaView>
  );
}
