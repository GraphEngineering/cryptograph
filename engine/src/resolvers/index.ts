export { default as PeopleAndDogs } from "./PeopleAndDogs";

export const jsonToResolvers = (schemaJson: object): object => ({
  Query: {
    message: () => "Hello, World!"
  }
});
