export const enum GameResult {
  Player1_20 = 0,
  Player1_21 = 1,
  Player2_12 = 2,
  Player2_02 = 3,
  Player1_30 = 4,
  Player1_31 = 5,
  Player1_32 = 6,
  Player2_23 = 7,
  Player2_13 = 8,
  Player2_03 = 9,
}

export const ThreeSetsGameResultLabels = {
  [GameResult.Player1_20]: '2-0',
  [GameResult.Player1_21]: '2-1',
  [GameResult.Player2_12]: '1-2',
  [GameResult.Player2_02]: '0-2',
};

export const FiveSetsGameResultLabels = {
  [GameResult.Player1_30]: '3-0',
  [GameResult.Player1_31]: '3-1',
  [GameResult.Player1_32]: '3-2',
  [GameResult.Player2_23]: '2-3',
  [GameResult.Player2_13]: '1-3',
  [GameResult.Player2_03]: '0-3',
};

export const GameResultLabels = {
  [GameResult.Player1_20]: '2-0',
  [GameResult.Player1_21]: '2-1',
  [GameResult.Player2_12]: '1-2',
  [GameResult.Player2_02]: '0-2',
  [GameResult.Player1_30]: '3-0',
  [GameResult.Player1_31]: '3-1',
  [GameResult.Player1_32]: '3-2',
  [GameResult.Player2_23]: '2-3',
  [GameResult.Player2_13]: '1-3',
  [GameResult.Player2_03]: '0-3',
};