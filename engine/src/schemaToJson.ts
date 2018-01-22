import { readFileSync } from "fs";

export default (schemaPath: string): object =>
  JSON.parse(readFileSync(`${schemaPath}/schema.json`).toString());
