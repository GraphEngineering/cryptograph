export default {
  Query: {
    request: (_: any, id: string) => tokens[0]
  },
  Token: {
    id: ({ id }: any) => id,

    name: ({ id }: any) => tokens[id].name,
    website: ({ id }: any) => tokens[id].website,
    markdown: ({ id }: any) => tokens[id].markdown,

    totalSupply: () => 100,
    balanceOf: (tokenOwner: string) => 100,
    allowance: (tokenOwner: string, spender: string) => 100
  }
};

const tokens = [
  {
    name: "Request Network",
    website: "https://request.network/",
    markdown: "# Request Network\nA decentralized network for payment requests"
  },
  {
    name: "Basic Attention Token",
    website: "https://basicattentiontoken.org/",
    markdown: null
  },
  {
    name: "Golem",
    website: "https://golem.network/",
    markdown: null
  }
].map((token, index) => ({
  id: `${index}`,
  ...token
}));
