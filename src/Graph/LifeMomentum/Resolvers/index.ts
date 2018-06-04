export const resolvers = {
  Query: {
    message: () => "Hello, World!",
    goals: () =>
      Object.entries(data.goals).map((it, index) => ({ ...it, id: index })),
    goal: (_source: never, { id }: { id: string }) => data.goals[id]
  }
};

const data: {
  goals: {
    [id: string]: any;
  };
} = {
  goals: {
    "1": {
      description: "Become the best possible version of myself."
    }
  }
};
