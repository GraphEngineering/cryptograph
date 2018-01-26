import {
  GraphQLAbstractType,
  GraphQLEnumType,
  GraphQLField,
  GraphQLFieldResolver,
  GraphQLLeafType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
  isAbstractType,
  isLeafType
} from "graphql";

export default (
  schema: GraphQLSchema
): { [typeName: string]: GraphQLFieldResolver<GraphQLObjectType, any> } =>
  Object.values(schema.getTypeMap()).reduce((typeResolvers, type) => {
    if (type instanceof GraphQLObjectType && !type.name.startsWith("__")) {
      return {
        ...typeResolvers,
        [type.name]: Object.values(type.getFields()).reduce(
          (fieldResolvers, field) => {
            return {
              ...fieldResolvers,
              [field.name]: resolver(field, field.type)
            };
          },
          {}
        )
      };
    }
    return { ...typeResolvers };
  }, {});

const resolver = (
  field: GraphQLField<any, any>,
  type: GraphQLOutputType
): GraphQLFieldResolver<any, any> =>
  type instanceof GraphQLNonNull
    ? resolver(field, type.ofType)
    : type instanceof GraphQLList
      ? listResolver(resolver(field, type.ofType))
      : isAbstractType(type)
        ? abstractTypeResolver(type)
        : isLeafType(type) ? leafTypeResolver(type) : () => ({});

const listResolver = (
  itemResolver: GraphQLFieldResolver<GraphQLOutputType, any>
): any => (...args) => [itemResolver(...args)];

const abstractTypeResolver = (
  type: GraphQLAbstractType
): GraphQLFieldResolver<GraphQLAbstractType, any> => () => type.name;

const leafTypeResolver = (
  type: GraphQLLeafType
): GraphQLFieldResolver<any, any> =>
  type instanceof GraphQLEnumType
    ? enumResolver(type)
    : scalarResolver(type) || (() => `<${type.name}>`);

const enumResolver = (
  type: GraphQLEnumType
): GraphQLFieldResolver<GraphQLEnumType, any> => type.getValues()[0].value;

const scalarResolver = (
  type: GraphQLScalarType
): GraphQLFieldResolver<GraphQLScalarType, any> =>
  primitiveScalarResolvers[type.name] || customScalarResolvers[type.name];

type JSONScalarValues = null | boolean | number | string;

const primitiveScalarResolvers: {
  [typeName: string]: () => JSONScalarValues;
} = {
  Boolean: () => true,
  Float: () => 12.34,
  ID: () => "ID",
  Int: () => 1234,
  String: () => "Hello, World!"
};

// const primitiveScalarTypeNames = Object.keys(primitiveScalarResolvers);

export const customScalarResolver = (
  type: GraphQLScalarType
): GraphQLFieldResolver<GraphQLScalarType, any> =>
  customScalarResolvers[type.name] || (() => 1);

const customScalarResolvers: {
  [typeName: string]: () => JSONScalarValues;
} = {
  Scalar: () => "AM_SCALAR"
};
