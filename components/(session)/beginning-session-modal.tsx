import { Colors } from "@/utils/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, ModalProps, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Text);

interface BeginningSessionModalProps extends ModalProps {
  timer: number;
}

export const BEGINNING_SESSION_MODAL_TIMER = 5;

export const BeginningSessionModal = ({ timer, ...props }: BeginningSessionModalProps) => {
  const firstMsgTimer = Math.ceil(BEGINNING_SESSION_MODAL_TIMER * 0.8);
  const secondMsgTimer = Math.ceil(BEGINNING_SESSION_MODAL_TIMER * 0.5);

  return (
    <Modal {...props} animationType="fade" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}>
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.9)", "rgba(0,0,0,0.3)"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <Text style={{ color: Colors.background }}>Début de la séance dans</Text>
        <Text style={{ color: Colors.background, fontSize: 48, fontWeight: "bold" }}>{timer}</Text>

        {timer <= firstMsgTimer && timer >= secondMsgTimer && (
          <AnimatedText
            entering={FadeIn}
            style={{ color: Colors.background, fontSize: 24, fontWeight: "bold" }}>
            Respirez un bon coup...
          </AnimatedText>
        )}

        {timer < secondMsgTimer && timer >= 0 && (
          <AnimatedText
            entering={FadeIn}
            style={{ color: Colors.background, fontSize: 24, fontWeight: "bold" }}>
            C'est parti ! Bonne séance.
          </AnimatedText>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
