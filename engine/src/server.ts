import * as fs from "fs";
import * as path from "path";

import * as express from "express";
import * as bodyParser from "body-parser";

import { makeExecutableSchema } from "graphql-tools";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { express as voyagerExpress } from "graphql-voyager/middleware";

import resolvers from "./resolvers";

// configure base server (schema and resolvers)

const SCHEMA = "PeopleAndDogs";

const typeDefs = fs
  .readFileSync(`../schemas/${SCHEMA}/${SCHEMA}.graphql`)
  .toString();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use("/graphql", (req, res, next) => {
  res.contentType("application/json");
  return next();
});

// configure tooling (GraphiQL and Voyager)

app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.use(
  "/voyager",
  voyagerExpress({ endpointUrl: "/graphql", displayOptions: {} })
);

// start the app

app.listen(8080);
