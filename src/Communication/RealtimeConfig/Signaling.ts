// src/realtime/signaling.ts

import { AssistantWebRTC } from "./WebRTC";
import { AssistantWebSocket, WSMessage } from "./Websocket";

type Handlers = {
  onRemoteStream?: (stream: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
};

export class WebRTCSignaling {
  private ws: AssistantWebSocket;
  private webrtc?: AssistantWebRTC;

  private handlers: Handlers;

  constructor(ws: AssistantWebSocket, handlers: Handlers = {}) {
    this.ws = ws;
    this.handlers = handlers;
  }

  // -------------------------
  // START / STOP SESSION
  // -------------------------

  async startVoiceSession() {
    if (this.webrtc) return;

    this.webrtc = new AssistantWebRTC(
      (msg) => this.ws.send(msg), // send signaling via WS
      {
        onRemoteStream: this.handlers.onRemoteStream,
        onConnected: this.handlers.onConnected,
        onDisconnected: this.handlers.onDisconnected,
      },
    );

    await this.webrtc.start();
  }

  async stopVoiceSession() {
    await this.webrtc?.stop();
    this.webrtc = undefined;
  }

  // -------------------------
  // HANDLE WS SIGNAL MESSAGES
  // -------------------------

  handleMessage(msg: WSMessage) {
    if (!this.webrtc) return;

    switch (msg.type) {
      case "webrtc_answer":
        this.webrtc.handleAnswer(msg.sdp);
        break;

      case "webrtc_ice":
        this.webrtc.handleRemoteIce(msg.candidate);
        break;

      // Optional: server-initiated renegotiation
      case "webrtc_offer":
        console.warn("Unexpected server offer");
        break;
    }
  }

  // -------------------------
  // UTILS
  // -------------------------

  isActive() {
    return !!this.webrtc;
  }
}
