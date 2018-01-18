const people = [
  { name: "Aaron" },
  { name: "Conner" },
  { name: "Chris" },
  { name: "Trey" },
  { name: "Hunter" },
  { name: "Todd" },
  { name: "Mike" }
].map((person, index) => ({
  id: `${index}`,
  ...person
}));

export default {
  Query: {
    people: () => people
  }
};
