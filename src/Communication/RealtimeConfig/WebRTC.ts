// src/realtime/webrtc.ts

import {
    mediaDevices,
    MediaStream,
    RTCPeerConnection,
    RTCSessionDescription,
} from "react-native-webrtc";

type SignalSend = (msg: any) => void;

type Handlers = {
  onRemoteStream?: (stream: MediaStream) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
};

export class AssistantWebRTC {
  private pc?: RTCPeerConnection;
  private localStream?: MediaStream;

  private sendSignal: SignalSend;
  private handlers: Handlers;

  constructor(sendSignal: SignalSend, handlers: Handlers = {}) {
    this.sendSignal = sendSignal;
    this.handlers = handlers;
  }

  // -------------------------
  // PUBLIC API
  // -------------------------

  async start() {
    this.pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add TURN here for production
      ],
    });

    this.setupPeerEvents();

    await this.startLocalAudio();
    await this.createAndSendOffer();
  }

  async stop() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc?.close();

    this.pc = undefined;
    this.localStream = undefined;

    this.handlers.onDisconnected?.();
  }

  // Called when server sends WebRTC answer
  async handleAnswer(sdp: any) {
    if (!this.pc) return;

    await this.pc.setRemoteDescription(
      new RTCSessionDescription({
        type: "answer",
        sdp,
      }),
    );
  }

  // Called when server sends ICE candidate
  async handleRemoteIce(candidate: any) {
    if (!this.pc || !candidate) return;

    await this.pc.addIceCandidate(candidate);
  }

  // -------------------------
  // INTERNALS
  // -------------------------

  private async startLocalAudio() {
    this.localStream = await mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    this.localStream.getTracks().forEach((track) => {
      this.pc?.addTrack(track, this.localStream!);
    });
  }

  private async createAndSendOffer() {
    if (!this.pc) return;

    const offer = await this.pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    });

    await this.pc.setLocalDescription(offer);

    this.sendSignal({
      type: "webrtc_offer",
      sdp: offer.sdp,
    });
  }

  private setupPeerEvents() {
    if (!this.pc) return;

    const pc = this.pc as any; // 👈 key fix

    // ICE candidates
    pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        this.sendSignal({
          type: "webrtc_ice",
          candidate: event.candidate,
        });
      }
    };

    // Remote audio track
    pc.ontrack = (event: any) => {
      const remoteStream = event.streams?.[0];
      if (remoteStream) {
        this.handlers.onRemoteStream?.(remoteStream);
      }
    };

    // Connection state
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;

      if (state === "connected") {
        this.handlers.onConnected?.();
      }

      if (
        state === "failed" ||
        state === "disconnected" ||
        state === "closed"
      ) {
        this.handlers.onDisconnected?.();
      }
    };
  }
}
