import express from "express";
import * as bodyParser from "body-parser";

import { makeExecutableSchema } from "graphql-tools";
import { graphqlExpress } from "apollo-server-express";

import expressPlayground from "graphql-playground-middleware-express";

const schema = makeExecutableSchema({
  typeDefs: `
    type Query {
      hello: String!
    }
  `,
  resolvers: {
    Query: {
      hello: () => "world"
    }
  }
});

const PORT = 4000;

const app = express();

app.use("/graph", bodyParser.json(), graphqlExpress({ schema }));
app.get("/playground", expressPlayground({ endpoint: "/graph" }));

app.listen(4000);

console.log(` http://localhost:${PORT}/playground`);
