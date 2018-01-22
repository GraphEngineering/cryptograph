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
  GraphQLSchema
} from "graphql";

import { makeExecutableSchema } from "graphql-tools";

export const sourceToSchema = (source: string): GraphQLSchema => {
  const schema = makeExecutableSchema({
    typeDefs: source
  });

  fakeSchema(schema);

  return schema;
};

const typeToResolver = (type: any) => ({ message: () => "Hello, World!" });

const getRandomInt = (min: number, max: number): number => 420;
const getRandomItem = (array: any[]): any => array[0];

const typeFakers: { [index: string]: any } = {
  Int: () => () => 420,
  Float: () => () => 4.2,
  String: () => () => "string",
  Boolean: () => () => true,
  ID: () => () => "ID"
};

const fakeValue = (type: string, options: any, locale: any) =>
  typeFakers[type]();

interface GraphQLAppliedDiretives {
  isApplied(directiveName: string): boolean;
  getAppliedDirectives(): Array<string>;
  getDirectiveArgs(directiveName: string): { [argName: string]: any };
}

type FakeArgs = {
  type: string;
  options: { [key: string]: any };
  locale: string;
};
type ExamplesArgs = {
  values: [any];
};
type DirectiveArgs = {
  fake?: FakeArgs;
  examples?: ExamplesArgs;
};

const stdTypeNames = Object.keys(typeFakers);

function astToJSON(ast: any) {
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
        (object: any, { name, value }: { name: any; value: any }) => {
          object[name.value] = astToJSON(value);
          return object;
        },
        {}
      );
  }
}

export function fakeSchema(schema: any) {
  const mutationTypeName = (schema.getMutationType() || {}).name;

  for (let type of (<any>Object).values(schema.getTypeMap())) {
    if (
      type instanceof GraphQLScalarType &&
      !(<any>stdTypeNames).includes(type.name)
    ) {
      type.serialize = value => value;
      type.parseLiteral = astToJSON;
      type.parseValue = x => x;
    }
    if (type instanceof GraphQLObjectType && !type.name.startsWith("__"))
      addFakeProperties(type);
    if (isAbstractType(type)) type.resolveType = obj => obj.__typename;
  }

  function addFakeProperties(objectType: GraphQLObjectType) {
    const isMutation = objectType.name === mutationTypeName;

    for (let field of (<any>Object).values(objectType.getFields())) {
      if (isMutation && isRelayMutation(field))
        field.resolve = getRelayMutationResolver();
      else field.resolve = getFieldResolver(field);
    }
  }

  function isRelayMutation(field: any) {
    const args = field.args;
    if (args.length !== 1 || args[0].name !== "input") return false;

    const inputType = args[0].type;
    // TODO: check presence of 'clientMutationId'
    return (
      inputType instanceof GraphQLNonNull &&
      inputType.ofType instanceof GraphQLInputObjectType &&
      field.type instanceof GraphQLObjectType
    );
  }

  function getFieldResolver(field: any) {
    const fakeResolver = getResolver(field.type, field);

    return (source: any, _0: any, _1: any, info: any) => {
      if (source && source.$example && source[field.name]) {
        return source[field.name];
      }

      const value = getCurrentSourceProperty(source, info.path);
      return value !== undefined ? value : fakeResolver();
    };
  }

  function getRelayMutationResolver() {
    return (source: any, args: any, _1: any, info: any) => {
      const value = getCurrentSourceProperty(source, info.path);
      if (value instanceof Error) return value;
      return { ...args["input"], ...value };
    };
  }

  // get value or Error instance injected by the proxy
  function getCurrentSourceProperty(source: any, path: any) {
    return source && source[path!.key];
  }

  function getResolver(type: GraphQLOutputType, field: any): any {
    if (type instanceof GraphQLNonNull) return getResolver(type.ofType, field);
    if (type instanceof GraphQLList)
      return arrayResolver(getResolver(type.ofType, field));

    if (isAbstractType(type)) return abstractTypeResolver(type);

    return fieldResolver(type, field);
  }

  function abstractTypeResolver(type: GraphQLAbstractType) {
    const possibleTypes = schema.getPossibleTypes(type);
    return () => ({ __typename: getRandomItem(possibleTypes) });
  }
}

function fieldResolver(type: GraphQLOutputType, field: any) {
  const directiveToArgs = {
    ...getFakeDirectives(type),
    ...getFakeDirectives(field)
  };
  const { fake, examples } = directiveToArgs;

  if (isLeafType(type)) {
    if (examples) return () => getRandomItem(examples.values);
    if (fake) {
      return () => fakeValue(fake.type, fake.options, fake.locale);
    }
    return getLeafResolver(type);
  } else {
    // TODO: error on fake directive
    if (examples) {
      return () => ({
        ...getRandomItem(examples.values),
        $example: true
      });
    }
    return () => ({});
  }
}

function arrayResolver(itemResolver: any) {
  return (...args: any[]) => {
    let length = getRandomInt(2, 4);
    const result = [];

    while (length-- !== 0) result.push(itemResolver(...args));
    return result;
  };
}

function getFakeDirectives(object: any) {
  const directives = object["appliedDirectives"] as GraphQLAppliedDiretives;
  if (!directives) return {};

  const result = {} as DirectiveArgs;
  if (directives.isApplied("fake"))
    result.fake = directives.getDirectiveArgs("fake") as FakeArgs;
  if (directives.isApplied("examples"))
    result.examples = directives.getDirectiveArgs("examples") as ExamplesArgs;
  return result;
}

function getLeafResolver(type: GraphQLLeafType) {
  if (type instanceof GraphQLEnumType) {
    const values = type.getValues().map(x => x.value);
    return () => getRandomItem(values);
  }

  const typeFaker = typeFakers[type.name];
  if (typeFaker) return typeFaker(typeFaker.defaultOptions);
  else return () => `<${type.name}>`;
}
