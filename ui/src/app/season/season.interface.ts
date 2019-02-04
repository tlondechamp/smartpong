export interface Season {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  placement_games: number;
  playoff_data: string;
  ranking: object | object[];
}
