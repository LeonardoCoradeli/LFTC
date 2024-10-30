export interface Position {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  position: Position;
  isStart: boolean;
  isAccept: boolean;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  symbol: string;
}