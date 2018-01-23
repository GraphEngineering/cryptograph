import {
  buildSchema,
  GraphQLEnumType,
  GraphQLEnumValue,
  GraphQLField,
  GraphQLFieldResolver,
  GraphQLInputType,
  GraphQLLeafType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
  isAbstractType,
  isLeafType,
  valueFromAST
} from "graphql";

type Resolver<TSource> = (
  type: TSource,
  field?: GraphQLField<TSource, any>
) => GraphQLFieldResolver<TSource, any>;

type FieldResolver = Resolver<any>;
type LeafResolver = Resolver<any>;
type EnumResolver = Resolver<any>;
type ScalarResolver = Resolver<any>;
type PrimitiveResolver = Resolver<any>;

export const sourceToSchema = (source: string): GraphQLSchema =>
  attachResolvers(buildSchema(source));

const attachResolvers = (schema: GraphQLSchema): GraphQLSchema => {
  Object.values(schema.getTypeMap()).forEach(type => {
    const { name } = type;

    if (
      type instanceof GraphQLScalarType &&
      !primitiveTypeNames.includes(name)
    ) {
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

const fieldResolver: FieldResolver = (type, field) => {
  if (type instanceof GraphQLNonNull) {
    return fieldResolver(type.ofType, field);
  }

  if (type instanceof GraphQLList) {
    return (source, context, args, info) => [
      fieldResolver(type.ofType, field)(source, context, args, info)
    ];
  }

  if (isAbstractType(type)) {
    return () => ({ __typename: type.name });
  }

  if (isLeafType(type)) {
    return leafTypeResolver(type);
  }

  return () => ({});
};

const leafTypeResolver: LeafResolver = type =>
  type instanceof GraphQLEnumType
    ? enumResolver(type)
    : scalarResolver(type) || (() => `<${type.name}>`);

const enumResolver: EnumResolver = type => () => type.getValues()[0].value;

const scalarResolver: ScalarResolver = type => primitiveResolver(type.name);

const primitiveResolver: PrimitiveResolver = type =>
  primitiveResolvers[type.name];

const primitiveResolvers: { [name: string]: () => any } = {
  Boolean: () => true,
  Float: () => 4.2,
  ID: () => "ID",
  Int: () => 420,
  String: () => "string"
};

const primitiveTypeNames = Object.keys(primitiveResolvers);
