export type Action = Mutation;

export interface Mutation {
  type: "Mutation";
  fieldName: string;
  arguments: {
    [argumentName: string]: any;
  };
}
