import data from "./data";

export default {
  Query: {
    people: () => data.people,
    person: (_: any, { id }: { id: string }): object | null => data.people[id],

    dogs: () => data.dogs,
    dog: (_: any, { id }: { id: string }): object | null => data.dogs[id]
  },
  Person: {
    dogs: ({ dogs }: { dogs: [string] }): object | null =>
      !dogs ? null : dogs.map(id => data.dogs[id])
  }
};
