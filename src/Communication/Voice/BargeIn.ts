// src/audio/bargeIn.ts

import { MicMonitor } from "./Mic";
import { PlaybackController } from "./PlayBack";

type SendInterrupt = () => void;

export class BargeInController {
  private mic: MicMonitor;
  private playback: PlaybackController;
  private sendInterrupt: SendInterrupt;

  private cooldown = false;

  constructor(
    mic: MicMonitor,
    playback: PlaybackController,
    sendInterrupt: SendInterrupt,
  ) {
    this.mic = mic;
    this.playback = playback;
    this.sendInterrupt = sendInterrupt;

    this.setup();
  }

  private setup() {
    this.mic = new MicMonitor({
      onSpeechStart: () => this.handleSpeechStart(),
    });
  }

  async start() {
    await this.mic.start();
  }

  stop() {
    this.mic.stop();
  }

  // -------------------------

  private handleSpeechStart() {
    // Only interrupt if assistant is speaking
    if (!this.playback.isPlaying()) return;

    // Prevent spam
    if (this.cooldown) return;

    this.cooldown = true;

    this.sendInterrupt();

    // Small cooldown to avoid repeated triggers
    setTimeout(() => {
      this.cooldown = false;
    }, 1000);
  }
}
