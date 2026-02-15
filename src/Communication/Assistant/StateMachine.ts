// src/assistant/stateMachine.ts

import { AssistantEvent } from "./Events";
import { TurnManager } from "./Turns";

export type AssistantState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "interrupted"
  | "disconnected";

type StateListener = (state: AssistantState) => void;

export class AssistantStateMachine {
  private state: AssistantState = "disconnected";
  private turnManager = new TurnManager();
  private listeners: StateListener[] = [];

  getState() {
    return this.state;
  }

  onStateChange(listener: StateListener) {
    this.listeners.push(listener);
  }

  private setState(newState: AssistantState) {
    if (this.state === newState) return;

    this.state = newState;
    this.listeners.forEach((l) => l(this.state));
  }

  dispatch(event: AssistantEvent) {
    switch (event.type) {
      case "WS_CONNECTED":
        this.setState("idle");
        break;

      case "WS_DISCONNECTED":
        this.setState("disconnected");
        break;

      case "USER_SPEECH_START":
        this.setState("listening");
        break;

      case "USER_SPEECH_END":
        this.setState("thinking");
        break;

      case "TURN_START":
        this.turnManager.startTurn(event.turnId);
        this.setState("thinking");
        break;

      case "ASSISTANT_SPEECH_START":
        this.setState("speaking");
        break;

      case "ASSISTANT_SPEECH_END":
        this.setState("idle");
        break;

      case "TURN_END":
        this.turnManager.endTurn(event.turnId);
        this.setState("idle");
        break;

      case "INTERRUPT":
        this.setState("interrupted");
        break;

      case "ERROR":
        this.setState("idle");
        break;
    }
  }
}
