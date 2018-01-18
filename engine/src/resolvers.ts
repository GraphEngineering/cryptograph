const nodes = [{ name: "TestNode" }].map((node, index) => ({
  id: `${index}`,
  name: node.name + index
}));

export default {
  Query: {
    nodes: () => nodes
  }
};
