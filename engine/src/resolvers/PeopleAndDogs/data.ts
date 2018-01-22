export interface Node {
  [id: string]: object | null;
}

const people: Node = {
  "0": {
    name: {
      first: "Conner",
      middle: "Thomas",
      last: "Ruhl"
    },
    friends: ["1", "2", "3"],
    dogs: ["0"]
  },
  "1": {
    name: {
      first: "Hunter",
      last: "Scheib"
    },
    dogs: ["2"]
  },
  "2": {
    name: {
      first: "Wayne",
      middle: "Dustin",
      last: "Noonan"
    },
    friends: ["3", "4"],
    dogs: ["1"]
  },
  "3": {
    name: {
      first: "Mike"
    },
    friends: ["0", "2"]
  },
  "4": {
    name: {
      first: "Aaron",
      last: "Donoho"
    },
    friends: ["2", "3"]
  }
};

const dogs: Node = {
  "0": {
    name: {
      first: "Eleanor"
    }
  },
  "1": {
    name: {
      first: "Frodo",
      last: "Porpington"
    }
  },
  "2": {
    name: {
      first: "Penny"
    }
  }
};

export const data = { people, dogs };
