interface Node {
  [index: string]: object;
}

const people: Node = {
  "1": {
    name: {
      first: "Conner",
      middle: "Thomas",
      last: "Ruhl"
    },
    dogs: ["1"]
  },
  "2": {
    name: {
      first: "Hunter",
      last: "Scheib"
    },
    dogs: ["2"]
  },
  "3": {
    name: {
      first: "Wayne",
      middle: "Dustin",
      last: "Noonan"
    },
    dogs: ["1"]
  },
  "4": {
    name: {
      first: "Mike"
    }
  },
  "5": {
    name: {
      first: "Aaron",
      last: "Donoho"
    }
  }
};

const dogs: Node = {
  "1": {
    name: {
      first: "Eleanor"
    }
  },
  "2": {
    name: {
      first: "Frodo",
      last: "Porpington"
    }
  },
  "3": {
    name: {
      first: "Penny"
    }
  }
};

export default {
  people,
  dogs
};
