import {
  buildSchema,
  GraphQLInputType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  isAbstractType,
  valueFromAST
} from "graphql";

import { fieldResolver, primitiveNames } from "./resolvers";

export const sourceToSchema = (source: string): GraphQLSchema =>
  attachResolvers(buildSchema(source));

const attachResolvers = (schema: GraphQLSchema): GraphQLSchema => {
  Object.values(schema.getTypeMap()).forEach(type => {
    const { name } = type;

    if (type instanceof GraphQLScalarType && !primitiveNames.includes(name)) {
      type.serialize = type.parseValue = value => value;
      type.parseLiteral = valueNode =>
        valueFromAST(valueNode, type as GraphQLInputType);
    }

    if (type instanceof GraphQLObjectType && !name.startsWith("__")) {
      Object.values(type.getFields()).forEach(field => {
        field.resolve = fieldResolver(field.type, field);
      });
    }

    if (isAbstractType(type)) {
      type.resolveType = object => object.__typename;
    }
  });

  return schema;
};
