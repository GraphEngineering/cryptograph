import { readFileSync } from "fs";

import * as bodyParser from "body-parser";
import * as express from "express";

import { buildASTSchema, parse } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

import { graphiqlExpress, graphqlExpress } from "apollo-server-express";

import { express as voyagerExpress } from "graphql-voyager/middleware";

import resolversFromSchema from "./resolversFromSchema";

// configure schema middleware

const SCHEMA_NAME = "StressTest";
const SCHEMA_PATH = `../schemas/${SCHEMA_NAME}`;

const source = readFileSync(`${SCHEMA_PATH}/schema.graphql`).toString();
const schemaAST = parse(source);
const schema = buildASTSchema(schemaAST);

const resolvers = resolversFromSchema(schema);

const schemaMiddleware = graphqlExpress({
  schema: makeExecutableSchema({
    typeDefs: schemaAST,
    resolvers
  })
});

// configure graphQL api

const app = express();

const headerMiddleware: express.RequestHandler = (_req, res, next) => {
  res.contentType("application/json");
  return next();
};

app.use("/graphql", bodyParser.json(), headerMiddleware, schemaMiddleware);

// configure tooling (graphiql and voyager)

app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.use(
  "/voyager",
  voyagerExpress({
    displayOptions: {},
    endpointUrl: "/graphql"
  })
);

// start the server

app.listen(8080);
