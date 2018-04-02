import * as fs from "fs";

import express from "express";
import * as bodyParser from "body-parser";

import { makeExecutableSchema } from "graphql-tools";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";

import { resolvers } from "./Graph/LifeMomentum/Resolvers";

const typeDefs = fs
  .readFileSync("./src/Graph/LifeMomentum/Schema/Main.graphql")
  .toString();

const PORT = 4000;

const app = express();

app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    tracing: true,
    schema: makeExecutableSchema({
      typeDefs,
      resolvers
    })
  })
);

app.get(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql"
  })
);

app.listen(PORT);

console.log(`http://localhost:${PORT}/graphiql`);
