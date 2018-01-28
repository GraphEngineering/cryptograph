import { readFileSync } from "fs";

import * as bodyParser from "body-parser";
import * as express from "express";

import { buildASTSchema, parse } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { express as voyagerExpress } from "graphql-voyager/middleware";

import resolversFromSchema from "./resolversFromSchema";

const SCHEMA_NAME = "PeopleAndDogs";
const SCHEMA_PATH = `../schemas/${SCHEMA_NAME}`;

const source = readFileSync(`${SCHEMA_PATH}/schema.graphql`).toString();
const ast = parse(source);
const schema = buildASTSchema(ast);

// `any` since `makeExecutableSchema` has `resolvers` as an optional field
const resolvers: any = resolversFromSchema(schema);

const schemaMiddleware = graphqlExpress({
  schema: makeExecutableSchema({
    resolvers,
    typeDefs: ast
  })
});

const headerMiddleware: express.RequestHandler = (_req, res, next) => {
  res.contentType("application/json");
  return next();
};

const graphiqlMiddleware = graphiqlExpress({ endpointURL: "/graphql" });

const voyagerMiddleware = voyagerExpress({
  displayOptions: {},
  endpointUrl: "/graphql"
});

express()
  .use("/graphql", bodyParser.json(), headerMiddleware, schemaMiddleware)
  .use("/graphiql", graphiqlMiddleware)
  .use("/voyager", voyagerMiddleware)
  .listen(8080);
