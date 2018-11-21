export interface Game {
  id: number;
  player1: number;
  player2: number;
  player1_details: object | object[];
  player2_details: object | object[];
  phase: number;
  result: number;
  player1_rating_change: number;
  player2_rating_change: number;
  date: string;
  season: number;
}
