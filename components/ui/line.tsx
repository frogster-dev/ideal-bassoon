import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface LineProps {
  left: string;
  right: string | number;
}

export const Line = ({ left, right }: LineProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.leftText}>{left}</Text>
      <Text style={styles.rightText}>{right}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 8 },
  leftText: { color: Colors.dark, flex: 1 },
  rightText: { color: Colors.dark, ...defaultStyles.textBold },
});
