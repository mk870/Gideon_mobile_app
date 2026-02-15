// src/audio/playback.ts

import { MediaStream } from "react-native-webrtc";

type Handlers = {
  onPlaybackStart?: () => void;
  onPlaybackStop?: () => void;
};

export class PlaybackController {
  private currentStream?: MediaStream;
  private handlers: Handlers;

  constructor(handlers: Handlers = {}) {
    this.handlers = handlers;
  }

  attachStream(stream: MediaStream) {
    this.currentStream = stream;

    // In RN WebRTC, audio plays automatically
    this.handlers.onPlaybackStart?.();
  }

  stop() {
    this.currentStream = undefined;
    this.handlers.onPlaybackStop?.();
  }

  isPlaying() {
    return !!this.currentStream;
  }
}
