import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { SquircleButton } from "expo-squircle-view";
import React, { useState } from "react";
import { Modal, ModalProps, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Text);

interface BeginningSessionModalProps extends ModalProps {
  timer: number;
  onAddTime: (seconds: number) => void;
}

export const BEGINNING_SESSION_MODAL_TIMER = 5;

export const BeginningSessionModal = ({
  timer,
  onAddTime,
  ...props
}: BeginningSessionModalProps) => {
  const { width } = useWindowDimensions();
  const firstMsgTimer = Math.ceil(BEGINNING_SESSION_MODAL_TIMER * 0.8);
  const secondMsgTimer = Math.ceil(BEGINNING_SESSION_MODAL_TIMER * 0.5);
  const [showPlusAnimation, setShowPlusAnimation] = useState(false);

  const handleAddTime = () => {
    if (timer > 0 && timer < 60) {
      onAddTime(5);
      setShowPlusAnimation(true);
      // Hide the animation after 1 second
      setTimeout(() => setShowPlusAnimation(false), 1000);
    }
  };

  const isButtonDisabled = timer === 0 || timer >= 60;

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
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)", "rgba(0,0,0,0.9)"]}
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

        {/* +5 Animation */}
        {showPlusAnimation && (
          <AnimatedText
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.plusAnimation, { bottom: width / 2 }]}>
            +5
          </AnimatedText>
        )}

        {/* Button Container at Bottom Center */}
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonLabel}>Pas encore prêt(e) ?</Text>
          <SquircleButton
            style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
            onPress={handleAddTime}
            disabled={isButtonDisabled}
            activeOpacity={0.8}>
            <Text style={[styles.buttonText, isButtonDisabled && styles.buttonTextDisabled]}>
              Ajouter +5
            </Text>
          </SquircleButton>
        </View>
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
  buttonContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 16,
  },
  buttonLabel: {
    color: Colors.background,
    ...defaultStyles.textBold,
  },
  button: {
    width: "70%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary700,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonDisabled: {
    backgroundColor: Colors.slate50,
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.background,
    ...defaultStyles.textBold,
  },
  buttonTextDisabled: {
    color: Colors.slate50,
  },
  plusAnimation: {
    position: "absolute",
    color: Colors.primary200,
    fontSize: 64,
    fontWeight: "bold",
  },
});
