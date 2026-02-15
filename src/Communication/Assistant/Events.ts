// src/assistant/events.ts

export type AssistantEvent =
  | { type: "WS_CONNECTED" }
  | { type: "WS_DISCONNECTED" }
  | { type: "TURN_START"; turnId: string }
  | { type: "TURN_END"; turnId: string }
  | { type: "USER_SPEECH_START" }
  | { type: "USER_SPEECH_END" }
  | { type: "ASSISTANT_SPEECH_START" }
  | { type: "ASSISTANT_SPEECH_END" }
  | { type: "INTERRUPT" }
  | { type: "ERROR"; message: string };
