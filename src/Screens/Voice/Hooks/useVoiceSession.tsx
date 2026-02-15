import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
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
  // iOS: permission is handled via Info.plist (NSMicrophoneUsageDescription)
  return true;
}

export function useVoiceSession(params: { wsUrl: string }) {
  const { wsUrl } = params;

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidateQueue = useRef<any[]>([]);

  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const start = async () => {
      setIsLoading(true);
      setError(null);

      // 1) Request microphone permission before anything else
      const hasPermission = await requestMicPermission();
      if (!hasPermission) {
        if (isMounted) {
          setError("Microphone permission denied");
          setIsLoading(false);
        }
        return;
      }

      // 2) WebSocket (signaling)
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 3) PeerConnection
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

      // ICE → send to backend
      pcAny.onicecandidate = (event: any) => {
        // if (event?.candidate && ws.readyState === WebSocket.OPEN) {
        //   ws.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
        // }
        if (event?.candidate) {
          console.log(
            "Full ICE candidate object:",
            JSON.stringify(event.candidate),
          );
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({ type: "ice", candidate: event.candidate }),
            );
          }
        } else {
          console.log("ICE gathering complete (client) ");
        }
      };

      // Log ICE errors for debugging
      pcAny.onicecandidateerror = (e: any) => {
        console.warn("ICE candidate error:", e?.errorCode, e?.errorText);
      };

      // Connection state → update UI + resolve loading
      pcAny.onconnectionstatechange = () => {
        if (!isMounted) return;
        const state: string = pcAny.connectionState;
        console.log("PC connection state:", state);
        setConnected(state === "connected");

        // Resolve loading on any terminal or established state
        if (
          state === "connected" ||
          state === "failed" ||
          state === "disconnected" ||
          state === "closed"
        ) {
          setIsLoading(false);
        }

        if (state === "failed") {
          setError("WebRTC connection failed");
        }
      };

      // Log signaling state for debugging
      pcAny.onsignalingstatechange = () => {
        console.log("Signaling state:", pcAny.signalingState);
      };

      // Receive server audio track (e.g. assistant audio)
      pcAny.ontrack = (event: any) => {
        console.log("Remote track received, kind:", event?.track?.kind);
      };

      // 4) Get microphone stream and add it via transceiver (more reliable in RN)
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

      // Use addTransceiver instead of addTrack — more reliable for bidirectional
      // audio in react-native-webrtc and avoids offerToReceiveAudio quirks
      micStream.getTracks().forEach((track: any) => {
        pcAny.addTransceiver(track, { direction: "sendrecv" });
      });

      // 5) WebSocket message handler (answer + ICE from server)
      ws.onmessage = async (ev) => {
        let msg: SignalMsg;
        try {
          msg = JSON.parse(ev.data) as SignalMsg;
        } catch {
          console.warn("Failed to parse WS message:", ev.data);
          return;
        }

        const pcNow = pcRef.current;
        if (!pcNow) return;

        if (msg.type === "answer") {
          try {
            await pcNow.setRemoteDescription(
              new RTCSessionDescription({
                type: "answer",
                sdp: msg.sdp.sdp, // ← drill into the nested object
              }),
            );
            console.log("Remote description set");

            // Flush any ICE candidates that arrived before the answer
            const queued = iceCandidateQueue.current.splice(0);
            for (const candidate of queued) {
              try {
                await pcNow.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (e) {
                console.warn("Failed to add queued ICE candidate:", e);
              }
            }
          } catch (e) {
            console.error("setRemoteDescription failed:", e);
          }
        }

        if (msg.type === "ice" && msg.candidate) {
          const pcNowAny = pcNow as any;
          if (pcNowAny.remoteDescription) {
            // Remote description already set — add immediately
            try {
              await pcNow.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } catch (e) {
              console.warn("addIceCandidate failed:", e);
            }
          } else {
            // Buffer it until after setRemoteDescription
            console.log("Queuing ICE candidate (no remote description yet)");
            iceCandidateQueue.current.push(msg.candidate);
          }
        }
      };

      // 6) When WS opens, create offer and send to server
      ws.onopen = async () => {
        console.log("WebSocket opened");
        const pcNow = pcRef.current;
        if (!pcNow) return;

        try {
          const offer = await (pcNow as any).createOffer({});
          await pcNow.setLocalDescription(offer);
          const msg: SignalMsg = {
            type: "offer",
            sdp: {
              type: offer.type, // "offer"
              sdp: offer.sdp ?? "", // the actual SDP string
            },
          };
          ws.send(JSON.stringify(msg));
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
        wsRef.current?.close();
      } catch {}
      try {
        pcRef.current?.close();
      } catch {}

      wsRef.current = null;
      pcRef.current = null;
    };
  }, [wsUrl]);

  return { connected, isLoading, error };
}
