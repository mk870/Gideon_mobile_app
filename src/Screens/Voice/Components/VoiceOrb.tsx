import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

type Props = {
  state:
    | "idle"
    | "listening"
    | "thinking"
    | "speaking"
    | "interrupted"
    | "disconnected";
  micLevel?: number; // 0 → 1 (optional)
};

export const VoiceOrb: React.FC<Props> = ({ state, micLevel = 0 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === "listening") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }

    if (state === "speaking") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }

    if (state === "idle" || state === "disconnected") {
      scale.stopAnimation();
      scale.setValue(1);
    }

    if (state === "thinking") {
      Animated.timing(glow, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      glow.setValue(0);
    }
  }, [state]);

  const dynamicScale = micLevel ? 1 + micLevel * 0.5 : scale;

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          transform: [{ scale: dynamicScale }],
          shadowOpacity: glow,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  orb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#4F46E5",
    shadowColor: "#6366F1",
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
});
