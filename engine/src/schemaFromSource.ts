import {
  Kind,
  isLeafType,
  isAbstractType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLAbstractType,
  GraphQLOutputType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLLeafType,
  GraphQLSchema,
  GraphQLFieldResolver,
  buildSchema,
  GraphQLNamedType,
  GraphQLTypeResolver,
  valueFromAST,
  ASTNode,
  ValueNode,
  GraphQLField
} from "graphql";

import { makeExecutableSchema } from "graphql-tools";

const getRandomInt = (min: number, max: number): number => 420;
const getRandomItem = (array: any[]): any => array[0];

const primitiveResolvers: { [index: string]: any } = {
  Int: () => 420,
  Float: () => 4.2,
  String: () => "string",
  Boolean: () => true,
  ID: () => "ID"
};

const primitiveTypes = Object.keys(primitiveResolvers);

export default (source: string): GraphQLSchema =>
  attachResolvers(buildSchema(source));

function astToJSON(ast: ASTNode): any {
  switch (ast.kind) {
    case Kind.NULL:
      return null;
    case Kind.INT:
      return parseInt(ast.value, 10);
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.LIST:
      return ast.values.map(astToJSON);
    case Kind.OBJECT:
      return ast.fields.reduce(
        (object: { [name: string]: any }, { name, value }) => {
          object[name.value] = astToJSON(value);
          return object;
        },
        {}
      );
  }
}

function attachResolvers(schema: GraphQLSchema): GraphQLSchema {
  for (let type of Object.values(schema.getTypeMap())) {
    if (
      type instanceof GraphQLScalarType &&
      !primitiveTypes.includes(type.name)
    ) {
      type.serialize = value => value;
      type.parseLiteral = astToJSON;
      type.parseValue = x => x;
    }

    if (type instanceof GraphQLObjectType && !type.name.startsWith("__")) {
      attachFieldResolvers(type);
    }

    if (isAbstractType(type)) {
      type.resolveType = obj => obj.__typename;
    }
  }

  return schema;
}

function attachFieldResolvers(type: GraphQLObjectType) {
  for (let field of Object.values(type.getFields())) {
    field.resolve = fieldResolver(field);
  }
}

function fieldResolver(field: GraphQLField<GraphQLObjectType, any>) {
  return (
    source: any,
    args: any,
    context: any,
    info: any
  ): GraphQLFieldResolver<GraphQLObjectType, any> =>
    resolver(field.type, field);
}

function resolver(
  type: GraphQLOutputType,
  field: GraphQLField<any, any>
): GraphQLFieldResolver<any, any> {
  if (type instanceof GraphQLNonNull) {
    return resolver(type.ofType, field);
  }

  if (type instanceof GraphQLList) {
    return arrayResolver(resolver(type.ofType, field));
  }

  if (isAbstractType(type)) {
    return abstractTypeResolver(type);
  }

  return fieldResolver(type, field); # HERE
}

function arrayResolver(itemResolver: any) {
  return (...args: any[]) => {
    let length = getRandomInt(2, 4);
    const result = [];

    while (length-- !== 0) result.push(itemResolver(...args));
    return result;
  };
}
