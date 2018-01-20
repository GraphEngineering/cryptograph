const people = [
  {
    name: {
      first: "Conner",
      middle: "Thomas",
      last: "Ruhl"
    },
    friends: ["1", "2", "3"],
    dogs: ["0"]
  },
  {
    name: {
      first: "Hunter",
      last: "Scheib"
    },
    dogs: ["2"]
  },
  {
    name: {
      first: "Wayne",
      middle: "Dustin",
      last: "Noonan"
    },
    friends: ["3", "4"],
    dogs: ["1"]
  },
  {
    name: {
      first: "Mike"
    },
    friends: ["0", "2"]
  },
  {
    name: {
      first: "Aaron",
      last: "Donoho"
    },
    friends: ["2", "3"]
  }
];

const dogs = [
  {
    name: {
      first: "Eleanor"
    }
  },
  {
    name: {
      first: "Frodo",
      last: "Porpington"
    }
  },
  {
    name: {
      first: "Penny"
    }
  }
];

const withIds = (nodes: object[]): object[] =>
  nodes.map((node, index) => ({
    id: `${index}`,
    ...node
  }));

export default {
  people: withIds(people),
  dogs: withIds(dogs)
};
