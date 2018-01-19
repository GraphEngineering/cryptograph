const people = [
  {
    name: {
      first: "Conner",
      middle: "Thomas",
      last: "Ruhl"
    },
    dogs: ["1"]
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
    dogs: ["1"]
  },
  {
    name: {
      first: "Mike"
    }
  },
  {
    name: {
      first: "Aaron",
      last: "Donoho"
    }
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
