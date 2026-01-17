/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import { PorcupineManager } from "@picovoice/porcupine-react-native";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Styles } from "./Styles";

const getWakeWordPath = async () => {
  const wakeWordModule = require("../../../../../assets/wake-words/gideon_android.ppn")
  const asset = Asset.fromModule(wakeWordModule);
  await asset.downloadAsync();
  return asset.localUri!;
}
const modelPath = await getWakeWordPath();

const WakeWordDetection = () => {
  const [isListening, setIsListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const porcupineAccessKey = Constants.expoConfig?.extra
    ?.porcupineAccessKey as string;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const porcupineManager = useRef<PorcupineManager | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (porcupineManager.current) {
        porcupineManager.current.delete();
      }
    };
  }, []);

  useEffect(() => {
    if (wakeWordDetected) {
      // Pulse animation
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Reset detection state
      setTimeout(() => setWakeWordDetected(false), 2000);
    }
  }, [wakeWordDetected]);

  const handleWakeWordDetection = (keywordIndex: number) => {
    console.log("Wake word detected! Index:", keywordIndex);
    setWakeWordDetected(true);
    setDetectionCount((prev) => prev + 1);

    // Trigger your assistant logic here
    activateAssistant();
  };

  const activateAssistant = () => {
    // Connect to WebSocket and start conversation
    console.log("Activating AI assistant...");

    // Example: Send signal to your Golang backend
    // websocket.send(JSON.stringify({
    //   type: 'wake_word_detected',
    //   keyword: 'gideon',
    //   timestamp: Date.now()
    // }));
  };

  const startListening = async () => {
    try {
      // Using custom wake word
      porcupineManager.current = await PorcupineManager.fromKeywordPaths(
        porcupineAccessKey,
        [modelPath],
        handleWakeWordDetection,
        (error) => {
          console.error("Porcupine error:", error);
        },
        undefined,
        [0.5] // Sensitivity: 0.0 (strict) to 1.0 (lenient)
      );

      await porcupineManager.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start:", err);
    }
  };

  const stopListening = async () => {
    try {
      if (porcupineManager.current) {
        await porcupineManager.current.stop();
        await porcupineManager.current.delete();
        porcupineManager.current = null;
      }
      setIsListening(false);
      console.log("Porcupine stopped");
    } catch (err: any) {
      console.error("Error stopping Porcupine:", err);
      setError(err.message);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View style={Styles.container}>
      <Animated.View
        style={[
          Styles.statusCircle,
          {
            transform: [{ scale: pulseAnim }],
            backgroundColor: wakeWordDetected
              ? "#4CAF50"
              : isListening
              ? "#2196F3"
              : "#9E9E9E",
          },
        ]}
      >
        <Text style={Styles.statusIcon}>
          {wakeWordDetected ? "✓" : isListening ? "🎤" : "○"}
        </Text>
      </Animated.View>

      <Text style={Styles.title}>
        {wakeWordDetected
          ? "🎉 Wake Word Detected!"
          : isListening
          ? 'Listening for "Gideon"...'
          : "Ready to Listen"}
      </Text>

      {isListening && (
        <View style={Styles.listeningIndicator}>
          <View style={[Styles.wave, Styles.wave1]} />
          <View style={[Styles.wave, Styles.wave2]} />
          <View style={[Styles.wave, Styles.wave3]} />
        </View>
      )}

      <TouchableOpacity
        style={[Styles.button, isListening && Styles.buttonActive]}
        onPress={toggleListening}
      >
        <Text style={Styles.buttonText}>
          {isListening ? "Stop Listening" : "Start Listening"}
        </Text>
      </TouchableOpacity>

      {error && (
        <View style={Styles.errorContainer}>
          <Text style={Styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <View style={Styles.statsContainer}>
        <View style={Styles.statItem}>
          <Text style={Styles.statLabel}>Detections</Text>
          <Text style={Styles.statValue}>{detectionCount}</Text>
        </View>
        <View style={Styles.statItem}>
          <Text style={Styles.statLabel}>Status</Text>
          <Text style={Styles.statValue}>
            {isListening ? "🟢 Active" : "🔴 Inactive"}
          </Text>
        </View>
      </View>

      <View style={Styles.infoContainer}>
        <Text style={Styles.infoTitle}>💡 Using Porcupine</Text>
        <Text style={Styles.infoText}>
          • Offline wake word detection{"\n"}• Low battery consumption{"\n"}•
        </Text>
      </View>

      <View style={Styles.customKeywordInfo}>
        <Text style={Styles.customKeywordTitle}>Want Gideon specifically?</Text>
        <Text style={Styles.customKeywordText}>
          Train a custom wake word at{"\n"}
          console.picovoice.ai
        </Text>
      </View>
    </View>
  );
};

export default WakeWordDetection;
