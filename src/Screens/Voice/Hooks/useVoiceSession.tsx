/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import InCallManager from "react-native-incall-manager";
import {
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from "react-native-webrtc";

type SignalMsg =
  | { type: "offer"; sdp: { type: string; sdp: string } }
  | { type: "answer"; sdp: { type: string; sdp: string } }
  | { type: "ice"; candidate: any };

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

export function useVoiceSession(params: {
  wsUrl: string;
  isSpeaking: boolean;
}) {
  const { wsUrl, isSpeaking } = params;

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidateQueue = useRef<any[]>([]);

  const micStreamRef = useRef<any>(null);
  const micTrackRef = useRef<any>(null);

  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Push-to-talk via track.enabled (simple + works well)
  useEffect(() => {
    const track = micTrackRef.current;
    if (!track) return;
    track.enabled = !!isSpeaking;
    //console.log("Mic track enabled:", track.enabled);
  }, [isSpeaking]);

  useEffect(() => {
    let isMounted = true;

    const start = async () => {
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

      // 1) WebSocket signaling
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 2) PeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.relay.metered.ca:80" },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "195892ae823813baf88a1d1d",
            credential: "dHhck1hqJSTJjfCy",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "195892ae823813baf88a1d1d",
            credential: "dHhck1hqJSTJjfCy",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "195892ae823813baf88a1d1d",
            credential: "dHhck1hqJSTJjfCy",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "195892ae823813baf88a1d1d",
            credential: "dHhck1hqJSTJjfCy",
          },
        ],
        iceCandidatePoolSize: 10,
      } as any);

      pcRef.current = pc;
      const pcAny = pc as any;

      // ✅ IMPORTANT: explicitly request to RECEIVE audio from server
      // This guarantees your offer includes an audio m-line with recv direction,
      // so the server's audio track will show up in ontrack.
      // try {
      //   pcAny.addTransceiver("audio", { direction: "recvonly" });
      // } catch (e) {
      //   console.warn("addTransceiver(recvonly) failed:", e);
      // }

      pcAny.onicecandidate = (event: any) => {
        if (event?.candidate && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
        }
      };

      pcAny.onconnectionstatechange = () => {
        if (!isMounted) return;
        const state: string = pcAny.connectionState;
        //console.log("PC connection state: ", state);

        setConnected(state === "connected");

        if (state === "connected") {
          // ✅ start audio session + route to speaker
          InCallManager.start({ media: "audio" });
          InCallManager.setMicrophoneMute(false);
          InCallManager.setForceSpeakerphoneOn(true);

          // optional: keep screen on during call
          InCallManager.setKeepScreenOn(true);
        }

        if (
          state === "failed" ||
          state === "disconnected" ||
          state === "closed"
        ) {
          try {
            InCallManager.stop();
          } catch {}
        }

        if (
          state === "connected" ||
          state === "failed" ||
          state === "disconnected" ||
          state === "closed"
        ) {
          setIsLoading(false);
        }

        if (state === "failed") setError("WebRTC connection failed");
      };

      // ✅ This should fire once server audio is negotiated + starts sending
      pcAny.ontrack = (event: any) => {
        console.log("Remote track received, kind:", event?.track?.kind);
        if (event?.track?.kind === "audio") {
          const [remoteStream] = event.streams || [];
          if (remoteStream) {
            console.log("Remote stream id:", remoteStream.id);
          } else {
            console.log("Remote audio track received without stream");
          }
        }
      };

      // 3) Microphone
      let micStream: any;
      try {
        micStream = await mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      } catch (err) {
        console.error("getUserMedia failed:", err);
        if (isMounted) {
          setError("Failed to access microphone");
          setIsLoading(false);
        }
        ws.close();
        pc.close();
        return;
      }

      micStreamRef.current = micStream;

      const [micTrack] = micStream.getAudioTracks();
      if (!micTrack) {
        if (isMounted) {
          setError("No microphone audio track available");
          setIsLoading(false);
        }
        ws.close();
        pc.close();
        return;
      }

      micTrackRef.current = micTrack;
      micTrack.enabled = !!isSpeaking; // start according to button
      //console.log("Mic track enabled:", micTrack.enabled);

      // Send mic track
      pc.addTrack(micTrack, micStream);

      // 4) WS incoming
      ws.onmessage = async (ev) => {
        let msg: SignalMsg;
        try {
          msg = JSON.parse(ev.data) as SignalMsg;
        } catch {
          console.warn("Failed to parse WS message:", ev.data);
          return;
        }

        if (msg.type === "answer") {
          try {
            await pc.setRemoteDescription(
              new RTCSessionDescription({ type: "answer", sdp: msg.sdp.sdp }),
            );
            //console.log("Remote description set (answer)");

            const queued = iceCandidateQueue.current.splice(0);
            for (const candidate of queued) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (e) {
                console.warn("Failed to add queued ICE:", e);
              }
            }
          } catch (e) {
            console.error("setRemoteDescription failed:", e);
          }
        }

        if (msg.type === "ice" && msg.candidate) {
          const pcAnyNow = pc as any;
          if (pcAnyNow.remoteDescription) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } catch (e) {
              console.warn("addIceCandidate failed: ", e);
            }
          } else {
            iceCandidateQueue.current.push(msg.candidate);
          }
        }
      };

      // 5) WS open -> create offer
      ws.onopen = async () => {
        //console.log("WebSocket opened");

        try {
          // ✅ Force offer to include receiving audio as well (extra safety)
          const offer = await (pc as any).createOffer({
            offerToReceiveAudio: true,
          });
          await pc.setLocalDescription(offer);

          const out: SignalMsg = {
            type: "offer",
            sdp: { type: offer.type, sdp: offer.sdp ?? "" },
          };

          ws.send(JSON.stringify(out));
          console.log("Offer sent");
        } catch (e) {
          console.error("createOffer/setLocalDescription failed:", e);
          if (isMounted) {
            setError("Failed to create WebRTC offer");
            setIsLoading(false);
          }
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        if (isMounted) {
          setError("WebSocket connection error");
          setIsLoading(false);
        }
      };

      ws.onclose = (e) => {
        console.log("WebSocket closed:", e.code, e.reason);
        if (!isMounted) return;
        setConnected(false);
        setIsLoading(false);
      };
    };

    start().catch((e) => {
      console.error("useVoiceSession start() threw:", e);
      if (isMounted) {
        setError(String(e));
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      iceCandidateQueue.current = [];

      try {
        const stream = micStreamRef.current;
        if (stream) stream.getTracks().forEach((t: any) => t.stop());
      } catch {}

      try {
        wsRef.current?.close();
      } catch {}
      try {
        pcRef.current?.close();
      } catch {}

      try {
        InCallManager.stop();
      } catch {}

      wsRef.current = null;
      pcRef.current = null;
      micStreamRef.current = null;
      micTrackRef.current = null;
    };
  }, [wsUrl]); // IMPORTANT: do not depend on isSpeaking

  return { connected, isLoading, error };
}
