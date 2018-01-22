import { readFileSync } from "fs";

import * as express from "express";
import * as bodyParser from "body-parser";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { express as voyagerExpress } from "graphql-voyager/middleware";

import schemaFromSource from "./schemaFromSource";

// configure base server (schema and resolvers)

const SCHEMA_NAME = "HelloWorld";
const SCHEMA_PATH = `../schemas/${SCHEMA_NAME}`;

const schema = schemaFromSource(
  readFileSync(`${SCHEMA_PATH}/schema.graphql`).toString()
);

const app = express();

app.use("/graphql", (req, res, next) => {
  res.contentType("application/json");
  return next();
});

app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// configure tooling (GraphiQL and Voyager)

app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.use(
  "/voyager",
  voyagerExpress({ endpointUrl: "/graphql", displayOptions: {} })
);

// start the app

app.listen(8080);
