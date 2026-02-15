// src/realtime/websocket.ts

export type WSMessage =
  | { type: "turn_start"; turnId: string }
  | { type: "turn_end"; turnId: string }
  | { type: "assistant_partial"; text: string }
  | { type: "assistant_final"; text: string }
  | { type: "transcript_partial"; text: string }
  | { type: "transcript_final"; text: string }
  | { type: "interrupt_ack" }
  | { type: "error"; message: string }
  | { type: string; [key: string]: any }; // fallback

export type WSStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

type Handlers = {
  onMessage?: (msg: WSMessage) => void;
  onStatus?: (status: WSStatus) => void;
};

export class AssistantWebSocket {
  private url: string;
  private jwt: string;
  private deviceCode: string;

  private ws?: WebSocket;
  private handlers: Handlers;

  private reconnectAttempts = 0;
  private manuallyClosed = false;

  status: WSStatus = "disconnected";

  constructor(
    url: string,
    jwt: string,
    deviceCode: string,
    handlers: Handlers = {},
  ) {
    this.url = url;
    this.jwt = jwt;
    this.deviceCode = deviceCode;
    this.handlers = handlers;
  }

  // -------------------------
  // PUBLIC API
  // -------------------------

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    this.manuallyClosed = false;
    this.setStatus(this.reconnectAttempts > 0 ? "reconnecting" : "connecting");

    const fullUrl = `${this.url}?token=${this.jwt}&device=${this.deviceCode}`;

    this.ws = new WebSocket(fullUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus("connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        this.handlers.onMessage?.(msg);
      } catch (err) {
        console.warn("Invalid WS message", event.data);
        console.log(err);
      }
    };

    this.ws.onerror = (err) => {
      console.warn("WebSocket error", err);
    };

    this.ws.onclose = () => {
      this.ws = undefined;

      if (!this.manuallyClosed) {
        this.scheduleReconnect();
      } else {
        this.setStatus("disconnected");
      }
    };
  }

  disconnect() {
    this.manuallyClosed = true;
    this.ws?.close();
    this.ws = undefined;
    this.setStatus("disconnected");
  }

  send(msg: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.warn("WS not connected — message dropped", msg);
    }
  }

  interrupt() {
    this.send({ type: "interrupt" });
  }

  // -------------------------
  // INTERNALS
  // -------------------------

  private setStatus(status: WSStatus) {
    this.status = status;
    this.handlers.onStatus?.(status);
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);

    this.setStatus("reconnecting");

    setTimeout(() => {
      if (!this.manuallyClosed) {
        this.connect();
      }
    }, delay);
  }
}
