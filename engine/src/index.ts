import { readFileSync } from "fs";

import * as bodyParser from "body-parser";
import * as express from "express";

import * as graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";

import { express as voyagerExpress } from "graphql-voyager/middleware";

import resolversFromSchema from "./resolversFromSchema";

// configure schema middleware

const SCHEMA_NAME = "PeopleAndDogs";
const SCHEMA_PATH = `../schemas/${SCHEMA_NAME}`;

const source = readFileSync(`${SCHEMA_PATH}/schema.graphql`).toString();
const schema = buildSchema(source);

const resolvers = resolversFromSchema(schema);

const schemaMiddleware = graphqlHTTP({
  graphiql: true,
  rootValue: resolvers,
  schema
});

// configure graphQL api

const app = express();

const headerMiddleware: express.RequestHandler = (_req, res, next) => {
  res.contentType("application/json");
  return next();
};

app.use("/graphql", bodyParser.json(), headerMiddleware, schemaMiddleware);

// configure voyager

app.use(
  "/voyager",
  voyagerExpress({
    displayOptions: {},
    endpointUrl: "/graphql"
  })
);

// start the server

app.listen(8080);
