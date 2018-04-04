import { State, Goal, Movement, Direction } from "./types";

const state: State = {
  goals: []
};

export const resolvers = {
  Query: {
    goals: () => state.goals
  },

  Mutation: {
    createGoal: (_parent: never, { title }: { title: string }) => {
      const goal = {
        id: state.goals.length.toString(),
        createdAt: new Date(),

        title,
        movements: []
      };

      state.goals.push(goal);

      return goal;
    },

    createMovement: (
      _parent: never,
      { goalId, direction }: { goalId: string; direction: Direction }
    ) => {
      const goal = state.goals.filter(({ id }) => id === goalId)[0];

      if (!goal) {
        return null;
      }

      const movement = {
        id: "1",
        createdAt: new Date(),

        direction
      };

      goal.movements.push(movement);

      return movement;
    }
  }
};
