export interface State {
  goals: Goal[];
}

export interface Goal {
  id: string;
  createdAt: Date;

  title: string;
  movements: Movement[];
}

export interface Movement {
  id: string;
  createdAt: Date;

  direction: Direction;
}

export enum Direction {
  BACKWARD = "BACKWARD",
  FORWARD = "FORWARD"
}
