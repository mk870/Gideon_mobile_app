import ScreenPage from "@/src/Components/ScreenWrapper/ScreenPage";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { NeonRing } from "./Components/VoiceSphere/VoiceSphere";

const BRIGHT_CYAN = '#00F7FF';
const DEEP_BLUE = '#0066FF';

const Voice = () => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  return (
    <ScreenPage>
    <NeonRing isSpeaking={true} />
    <TouchableOpacity
        style={[styles.button, isSpeaking && styles.buttonActive]}
        onPress={() => setIsSpeaking(!isSpeaking)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isSpeaking ? 'Stop Speaking' : 'Simulate AI Response'}
        </Text>
      </TouchableOpacity>
    </ScreenPage>
  );
};

export default Voice;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000814', // Very dark blue/black background defines the neon look
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 50,
  },
  title: {
    color: BRIGHT_CYAN,
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 1,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: DEEP_BLUE,
  },
  buttonActive: {
    borderColor: BRIGHT_CYAN,
    backgroundColor: 'rgba(0, 247, 255, 0.1)',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
