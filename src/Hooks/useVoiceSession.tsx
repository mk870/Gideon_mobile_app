/* eslint-disable react-hooks/exhaustive-deps */
import {
  RecordingPresets,
  createAudioPlayer,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import * as LegacyFS from "expo-file-system/legacy";
import { File, Paths } from "expo-file-system/next";
import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import InCallManager from "react-native-incall-manager";

async function requestMicPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Microphone Permission",
        message: "This app needs access to your microphone for voice calls.",
        buttonPositive: "Allow",
      },
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

type Params = {
  wsUrl: string | null;
  uploadUrl: string | null;
  isSpeaking: boolean;
  accessToken: string | null;
  deviceCode: string | null;
};

export function useVoiceSession(params: Params) {
  const { wsUrl, uploadUrl, isSpeaking, accessToken, deviceCode } = params;

  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<Uint8Array[]>([]);
  const isPlayingRef = useRef(false);
  const isUploadingRef = useRef(false);

  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const sendJson = (msg: any) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(msg));
    return true;
  };

  useEffect(() => {
    if (!wsUrl || !uploadUrl || !accessToken || !deviceCode) return;
    if (isSpeaking) {
      startRecording();
    } else {
      stopAndUpload();
    }
  }, [isSpeaking, wsUrl, uploadUrl, accessToken, deviceCode]);

  const startRecording = async () => {
    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (err) {
      console.error("startRecording failed:", err);
    }
  };

  const stopAndUpload = async () => {
    if (!recorder.isRecording || isUploadingRef.current) return;
    if (!uploadUrl || !accessToken || !deviceCode) return;

    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) return;

      const file = new File(uri);
      if (!file.exists || file.size === 0) return;

      isUploadingRef.current = true;

      const extension = uri.split(".").pop()?.toLowerCase() ?? "m4a";
      const mimeMap: Record<string, string> = {
        wav: "audio/wav",
        m4a: "audio/m4a",
        mp4: "audio/mp4",
        webm: "audio/webm",
        ogg: "audio/ogg",
      };
      const mimeType = mimeMap[extension] ?? "audio/m4a";

      const formData = new FormData();
      formData.append("audio", {
        uri,
        name: `audio.${extension}`,
        type: mimeType,
      } as any);
      formData.append("format", extension);
      formData.append("deviceCode", deviceCode);

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!result.ok) {
        const body = await result.text();
        console.error("Upload failed:", result.status, body);
      } else {
        const body = await result.json();
        if (body.status === "silent") {
          console.log("Audio was silent, skipped STT");
        } else {
          console.log("Audio enqueued for STT");
        }
      }

      new File(uri).delete();
    } catch (err) {
      console.error("stopAndUpload failed:", err);
    } finally {
      isUploadingRef.current = false;
    }
  };

  const playAudioQueue = async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
    isPlayingRef.current = true;

    while (audioQueueRef.current.length > 0) {
      const opus = audioQueueRef.current.shift()!;
      let tmpPath: string | null = null;
      let player: ReturnType<typeof createAudioPlayer> | null = null;

      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });

        // Write as base64 — FileSystem.writeAsStringAsync with base64 encoding
        // correctly writes raw binary bytes to disk. Using expo-file-system/next
        // File.write() with a Uint8Array coerces it to "0,255,79,..." causing static.
        // LegacyFS.writeAsStringAsync with base64 is the only reliable way
        // to write raw binary bytes to disk in React Native / Expo
        const tmpPath_ = `${Paths.cache.uri}audio_${Date.now()}.ogg`;
        tmpPath = tmpPath_;
        const base64 = btoa(String.fromCharCode(...opus));
        await LegacyFS.writeAsStringAsync(tmpPath_, base64, {
          encoding: "base64",
        });

        player = createAudioPlayer({ uri: tmpPath });

        await new Promise<void>((resolve, reject) => {
          if (!player) return resolve();

          let hasStartedPlaying = false;

          player.addListener("playbackStatusUpdate", (status: any) => {
            if (status.isLoaded && !hasStartedPlaying) {
              hasStartedPlaying = true;
              player!.play();
              return;
            }
            if (status.didJustFinish) {
              resolve();
              return;
            }
            if (
              hasStartedPlaying &&
              !status.isLoaded &&
              status.playbackState === "idle"
            ) {
              resolve();
              return;
            }
            if (status.error) reject(new Error(status.error));
          });
        });
      } catch (err) {
        console.error("playback error:", err);
      } finally {
        try {
          player?.remove();
        } catch {}
        try {
          if (tmpPath) new File(tmpPath).delete();
        } catch {}
      }
    }

    isPlayingRef.current = false;
  };

  useEffect(() => {
    let isMounted = true;

    const start = async () => {
      if (!wsUrl || !uploadUrl || !accessToken || !deviceCode) {
        setConnected(false);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      const hasPermission = await requestMicPermission();
      if (!hasPermission) {
        if (isMounted) {
          setError("Microphone permission denied.");
          setIsLoading(false);
        }
        return;
      }

      await requestRecordingPermissionsAsync();

      InCallManager.start({ media: "audio" });
      InCallManager.setForceSpeakerphoneOn(true);
      InCallManager.setKeepScreenOn(true);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        if (!isMounted) return;
        console.log("WebSocket connected");
        setConnected(true);
        setIsLoading(false);
      };

      ws.onmessage = async (ev) => {
        if (ev.data instanceof ArrayBuffer) {
          audioQueueRef.current.push(new Uint8Array(ev.data));
          playAudioQueue();
          return;
        }

        try {
          const msg = JSON.parse(ev.data as string);
          if (msg.type === "error") {
            console.error("Server error:", msg.message);
          }
        } catch (err) {
          console.error("WS message parse error:", err);
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        if (isMounted) {
          setError("WebSocket connection error");
          setIsLoading(false);
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setConnected(false);
        setIsLoading(false);
        InCallManager.stop();
      };
    };

    start().catch((e) => {
      if (isMounted) {
        setError(String(e));
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      try {
        if (recorder.isRecording) recorder.stop();
      } catch {}
      try {
        wsRef.current?.close();
      } catch {}
      try {
        InCallManager.stop();
      } catch {}

      wsRef.current = null;
      audioQueueRef.current = [];
      isPlayingRef.current = false;
    };
  }, [wsUrl]);

  return {
    connected,
    isLoading,
    error,
    sendJson,
  };
}
