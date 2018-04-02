export type Action = Mutation;

export interface Mutation {
  type: "Mutation";
  arguments: {
    [argumentName: string]: any;
  };
}
