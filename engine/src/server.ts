import * as express from "express";
import * as bodyParser from "body-parser";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";

const schema = null;

const app = express();

app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.listen(8080);
