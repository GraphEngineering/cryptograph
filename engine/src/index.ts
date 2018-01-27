import { readFileSync } from "fs";

import * as bodyParser from "body-parser";
import * as express from "express";

import { buildASTSchema, parse } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { express as voyagerExpress } from "graphql-voyager/middleware";

import resolversFromSchema from "./resolversFromSchema";

const SCHEMA_NAME = "StressTest";
const SCHEMA_PATH = `../schemas/${SCHEMA_NAME}`;

const source = readFileSync(`${SCHEMA_PATH}/schema.graphql`).toString();
const ast = parse(source);
const schema = buildASTSchema(ast);

// required since `makeExecutableSchema` has `resolvers` as an optional field
const resolvers: any | undefined = resolversFromSchema(schema);

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

express()
  .use("/graphql", bodyParser.json(), headerMiddleware, schemaMiddleware)
  .use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }))
  .use(
    "/voyager",
    voyagerExpress({ displayOptions: {}, endpointUrl: "/graphql" })
  )
  .listen(8080);
