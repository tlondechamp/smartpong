export const enum GameResult {
  Player1_20 = 0,
  Player1_21 = 1,
  Player2_12 = 2,
  Player2_02 = 3,
}

export const GameResultLabels = {
  [GameResult.Player1_20]: '2-0',
  [GameResult.Player1_21]: '2-1',
  [GameResult.Player2_12]: '1-2',
  [GameResult.Player2_02]: '0-2',
};