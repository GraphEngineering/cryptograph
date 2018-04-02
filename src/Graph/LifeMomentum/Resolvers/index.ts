import { store } from "~/State";

export const resolvers = {
  Query: {
    goals: () => []
  },
  Mutation: {
    setNewGoal: (_parent: never, { title }: { title: string }) => {
      store.dispatch({
        type: "Mutation",
        arguments: { title }
      });
    },

    newMovementForGoal: (
      _parent: never,
      { direction }: { goal: string; direction: string }
    ) => ({
      id: "1",
      createdAt: new Date(),

      direction
    })
  }
};
