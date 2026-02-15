// src/audio/mic.ts

type Handlers = {
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onLevel?: (level: number) => void;
};

export class MicMonitor {
  private stream?: MediaStream;
  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;

  // ✅ Force the exact type DOM expects
  private dataArray?: Uint8Array<ArrayBuffer>;

  private rafId?: number;
  private speaking = false;

  private threshold = 0.08;
  private silenceDelay = 600;

  private silenceTimer?: ReturnType<typeof setTimeout>;

  constructor(private handlers: Handlers = {}) {}

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.stream);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;

    source.connect(this.analyser);

    const buffer = new ArrayBuffer(this.analyser.fftSize);
    this.dataArray = new Uint8Array(buffer) as Uint8Array<ArrayBuffer>;

    this.loop();
  }

  stop() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.audioContext?.close();

    if (this.rafId) cancelAnimationFrame(this.rafId);

    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.silenceTimer = undefined;
    this.speaking = false;
  }

  private loop = () => {
    if (!this.analyser || !this.dataArray) return;

    // ✅ Now this matches the DOM typing exactly
    this.analyser.getByteTimeDomainData(this.dataArray);

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const v = (this.dataArray[i] - 128) / 128;
      sum += v * v;
    }

    const rms = Math.sqrt(sum / this.dataArray.length);

    this.handlers.onLevel?.(rms);

    if (rms > this.threshold) this.handleSpeechDetected();
    else this.handleSilence();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private handleSpeechDetected() {
    if (!this.speaking) {
      this.speaking = true;
      this.handlers.onSpeechStart?.();
    }

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = undefined;
    }
  }

  private handleSilence() {
    if (!this.speaking) return;

    if (!this.silenceTimer) {
      this.silenceTimer = setTimeout(() => {
        this.speaking = false;
        this.handlers.onSpeechEnd?.();
      }, this.silenceDelay);
    }
  }
}
