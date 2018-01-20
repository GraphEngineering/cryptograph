import { data, Node } from "./data";

const mapToList = (map: Node): object[] =>
  Object.keys(map).map(id => addId(id, map[id]));

const addId = (id: string, object: object | null): object => ({
  id,
  ...object
});

export default {
  Query: {
    people: (): object => mapToList(data.people),
    person: (_: any, { id }: { id: string }): object | null =>
      addId(id, data.people[id]),

    dogs: () => mapToList(data.dogs),
    dog: (_: any, { id }: { id: string }): object | null =>
      addId(id, data.dogs[id])
  },
  Person: {
    friends: ({ friends }: { friends: [string] | null }): object | null =>
      friends &&
      friends.map((id: string): object | null => addId(id, data.people[id])),

    dogs: ({ dogs }: { dogs: [string] | null }): object | null =>
      dogs && dogs.map((id: string): object | null => addId(id, data.dogs[id]))
  }
};
