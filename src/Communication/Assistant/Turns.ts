// src/assistant/turns.ts

export class TurnManager {
  private currentTurnId?: string;

  startTurn(turnId: string) {
    this.currentTurnId = turnId;
  }

  endTurn(turnId: string) {
    if (this.currentTurnId === turnId) {
      this.currentTurnId = undefined;
    }
  }

  getCurrentTurn() {
    return this.currentTurnId;
  }

  isCurrent(turnId: string) {
    return this.currentTurnId === turnId;
  }

  clear() {
    this.currentTurnId = undefined;
  }
}
