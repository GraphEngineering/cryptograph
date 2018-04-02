export interface State {
  goals: Goal[];
  movements: Movement[];
}

export interface Goal {
  id: string;
  createAt: Date;

  title: string;
  movements: string[];
}

export interface Movement {
  id: string;
  createAt: Date;

  direction: Direction;
}

export enum Direction {
  BACKWARD,
  FORWARD
}
