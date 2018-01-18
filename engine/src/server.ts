import * as fs from "fs";
import * as path from "path";

import * as express from "express";
import * as bodyParser from "body-parser";

import { makeExecutableSchema } from "graphql-tools";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";

import resolvers from "./resolvers";

const SCHEMA = "SimpleTest";

const typeDefs = fs
  .readFileSync(`../schemas/${SCHEMA}/${SCHEMA}.graphql`)
  .toString();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use("/graphql", (req, res, next) => {
  res.contentType("application/json");
  return next();
});

app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.listen(8080);
