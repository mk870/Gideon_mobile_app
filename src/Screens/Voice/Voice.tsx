import ScreenPage from "@/src/Components/ScreenWrapper/ScreenPage";
import ScreenSpinner from "@/src/Components/Spinners/ScreenSpinner";
import { useAppSelector } from "@/src/Redux/Hooks/Config";
import { backEndUrl, socketUrl } from "@/src/Utils/Constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useVoiceSession } from "./Hooks/useVoiceSession";

const BRIGHT_CYAN = "#00F7FF";
const DEEP_BLUE = "#0066FF";

const Voice = () => {
  const { accessToken, deviceCode } = useAppSelector(
    (state) => state.user.value,
  );
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const cleanDeviceCode = decodeURIComponent(deviceCode).replace(/^"|"$/g, "");
  // Result: 57557891-47e3-40fe-882a-9f2b520e34f3

  const cleanToken = decodeURIComponent(accessToken).replace(/^"|"$/g, "");
  // console.log("Clean Device Code:", cleanDeviceCode);
  // console.log("Clean Access Token:", cleanToken);
  //console.log("DeviceCode:", encodeURIComponent(cleanDeviceCode));
  const wsUrl = `${socketUrl}?deviceCode=${encodeURIComponent(cleanDeviceCode)}&token=${encodeURIComponent(cleanToken)}`;

  const { connected, isLoading, error } = useVoiceSession({
    wsUrl: wsUrl,
    isSpeaking: isSpeaking,
    accessToken: cleanToken,
    deviceCode: cleanDeviceCode,
    uploadUrl: `${backEndUrl}/audio`,
  });
  //console.log("WebSocket connected:", connected);
  return (
    <ScreenPage>
      {/* <NeonRing isSpeaking={true} /> */}
      {/* <WakeWordDetection/> */}
      {isLoading ? (
        <ScreenSpinner />
      ) : (
        <TouchableOpacity
          style={[styles.button, isSpeaking && styles.buttonActive]}
          onPress={() => setIsSpeaking(!isSpeaking)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isSpeaking ? "Stop Speaking" : "Simulate AI Response"}
          </Text>
        </TouchableOpacity>
      )}
    </ScreenPage>
  );
};

export default Voice;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000814", // Very dark blue/black background defines the neon look
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 50,
  },
  title: {
    color: BRIGHT_CYAN,
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 1,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "transparent",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: DEEP_BLUE,
  },
  buttonActive: {
    borderColor: BRIGHT_CYAN,
    backgroundColor: "rgba(0, 247, 255, 0.1)",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
