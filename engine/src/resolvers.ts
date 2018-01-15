export default {
  Query: {
    tokens: () => tokens,
    token: (_: any, id: string) => tokens[parseInt(id)]
  },
  Token: {
    id: ({ id }: any) => id,
    name: ({ id }: any) => tokens[id].name,
    website: ({ id }: any) => tokens[id].website,
    markdown: ({ id }: any) => tokens[id].markdown
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
