import data from "./data";

export default {
  Query: {
    people: () => data.people,
    person: (_: any, { id }: { id: string }) => data.people[parseInt(id)],

    dogs: () => data.dogs,
    dog: (_: any, { id }: { id: string }) => data.dogs[parseInt(id)]
  },
  Person: {
    dogs: ({ dogs }: { dogs: [string] }) =>
      !dogs ? null : dogs.map(id => data.dogs[parseInt(id)])
  }
};
