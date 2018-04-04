import { State } from "./types";
import { Action, Mutation } from "./actions";

export default (
  state: State = {
    goals: [],
    movements: []
  },
  action: Action
) => {
  switch (action.type) {
    case Mutation:
      return state;
  }

  return state;
};
