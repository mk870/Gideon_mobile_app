import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

import { useVoiceSession } from "../Hooks/useVoiceSession";
import { useAppSelector } from "../Redux/Hooks/Config";
import { backEndUrl, socketUrl } from "../Utils/Constants";

type VoiceContextType = {
  isSpeaking: boolean;
  setIsSpeaking: Dispatch<SetStateAction<boolean>>;
  connected: boolean;
  isLoading: boolean;
  error: string | null;
  canStartSession: boolean;
  wsUrl: string | null;
  uploadUrl: string | null;
  sendJson: (msg: any) => boolean;
};

const VoiceContext = createContext<VoiceContextType | null>(null);

const buildWsUrl = (deviceCode: string, webSocketToken: string) => {
  const cleanDeviceCode = decodeURIComponent(deviceCode).replace(/^"|"$/g, "");
  const cleanToken = decodeURIComponent(webSocketToken).replace(/^"|"$/g, "");
  console.log(
    "url",
    `${socketUrl}?deviceCode=${encodeURIComponent(cleanDeviceCode)}&token=${encodeURIComponent(cleanToken)}`,
  );
  return `${socketUrl}?deviceCode=${encodeURIComponent(cleanDeviceCode)}&token=${encodeURIComponent(cleanToken)}`;
};

export const VoiceContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // From Redux (you already set these in app entry from SecureStore)
  const webSocketToken = useAppSelector((s) => s.user.value.webSocketToken);
  const accessTokenStored = useAppSelector((s) => s.user.value.accessToken);
  const deviceCode = useAppSelector((s) => s.user.value.deviceCode);

  // Your token is stored JSON-stringified (you use JSON.parse(...) elsewhere)
  const accessToken = useMemo(() => {
    if (!accessTokenStored) return null;
    try {
      return JSON.parse(accessTokenStored);
    } catch {
      return accessTokenStored; // fallback if already raw
    }
  }, [accessTokenStored]);

  const canStartSession = Boolean(accessToken && deviceCode && webSocketToken);

  const wsUrl = useMemo(() => {
    if (!accessToken || !deviceCode || !webSocketToken) return null;
    return buildWsUrl(deviceCode, webSocketToken);
  }, [accessToken, deviceCode, webSocketToken]);

  const uploadUrl = useMemo(() => {
    if (!deviceCode) return null;
    // change this to your real upload endpoint
    return `${backEndUrl}/audio`;
  }, [deviceCode]);

  const session = useVoiceSession({
    wsUrl,
    uploadUrl,
    isSpeaking,
    accessToken,
    deviceCode,
  });

  const value = useMemo<VoiceContextType>(
    () => ({
      isSpeaking,
      setIsSpeaking,

      connected: canStartSession ? session.connected : false,
      isLoading: canStartSession ? session.isLoading : false,
      error: canStartSession ? session.error : null,

      canStartSession,
      wsUrl,
      uploadUrl,

      sendJson: session.sendJson,
    }),
    [
      isSpeaking,
      canStartSession,
      session.connected,
      session.isLoading,
      session.error,
      wsUrl,
      uploadUrl,
      session.sendJson,
    ],
  );

  return (
    <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
  );
};

export function useVoiceContext() {
  const ctx = useContext(VoiceContext);
  if (!ctx)
    throw new Error(
      "useVoiceContext must be used inside VoiceContextProvider.",
    );
  return ctx;
}
