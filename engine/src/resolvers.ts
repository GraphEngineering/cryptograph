export default {
  Query: {
    tokens: () => tokens
  },
  Token: () => ({
    name: () => null,
    website: () => null,
    markdown: () => null
  })
};

const tokens = [
  {
    name: "The Request Network",
    website: "https://request.network/",
    markdown: `
# Request Network
A decentralized network for payment requests
`
  }
];
