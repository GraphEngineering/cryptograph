import {
  GraphQLAbstractType,
  GraphQLEnumType,
  GraphQLField,
  GraphQLFieldResolver,
  GraphQLLeafType,
  GraphQLList,
  GraphQLNamedType,
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
): { [typeName: string]: GraphQLFieldResolver<any, any> } =>
  Object.values(schema.getTypeMap()).reduce(attachTypeResolver, {});

interface ITypeResolvers {
  [typeName: string]: Resolver;
}

type Resolver =
  | GraphQLFieldResolver<GraphQLNamedType, any>
  | IEnumResolver
  | {};

interface IFieldResolvers {
  [fieldName: string]: GraphQLFieldResolver<any, any>;
}

const attachTypeResolver = (
  typeResolvers: ITypeResolvers,
  resolveType: GraphQLNamedType
): ITypeResolvers =>
  resolveType instanceof GraphQLObjectType && !resolveType.name.startsWith("__")
    ? {
        ...typeResolvers,
        [resolveType.name]: Object.values(resolveType.getFields()).reduce(
          attachFieldResolver,
          {}
        )
      }
    : typeResolvers;

const attachFieldResolver = (
  fieldResolvers: IFieldResolvers,
  field: GraphQLField<any, any>
): IFieldResolvers => ({
  ...fieldResolvers,
  [field.name]: resolver(field, field.type)
});

const resolver = (
  field: GraphQLField<any, any>,
  resolveType: GraphQLOutputType
): Resolver =>
  resolveType instanceof GraphQLNonNull
    ? resolver(field, resolveType.ofType)
    : resolveType instanceof GraphQLList
      ? listResolver(resolver(field, resolveType.ofType))
      : isAbstractType(resolveType)
        ? abstractTypeResolver(resolveType)
        : isLeafType(resolveType) ? leafTypeResolver(resolveType) : () => ({});

const listResolver = (
  itemResolver: GraphQLFieldResolver<GraphQLOutputType, any>
): GraphQLFieldResolver<any, any> => (source, args, context, info) => [
  itemResolver(source, args, context, info)
];

const abstractTypeResolver = (
  resolveType: GraphQLAbstractType
): GraphQLFieldResolver<GraphQLAbstractType, any> => () => resolveType.name;

const leafTypeResolver = (resolveType: GraphQLLeafType): Resolver =>
  resolveType instanceof GraphQLEnumType
    ? enumResolver(resolveType)
    : scalarResolver(resolveType) || (() => `<${resolveType.name}>`);

interface IEnumResolver {
  [enumValue: string]: number | string;
}

const enumResolver = (enumType: GraphQLEnumType): IEnumResolver => ({
  [enumType.getValues()[0].value]: enumType.getValues()[0].value
});

const scalarResolver = (
  scalarType: GraphQLScalarType
): GraphQLFieldResolver<GraphQLScalarType, any> =>
  primitiveScalarResolvers[scalarType.name] ||
  customScalarResolvers[scalarType.name];

type PrimitiveScalarValues = null | boolean | number | string;

const primitiveScalarResolvers: {
  [typeName: string]: () => PrimitiveScalarValues;
} = {
  Boolean: () => true,
  Float: () => 12.34,
  ID: () => "ID",
  Int: () => 1234,
  String: () => "Hello, World!"
};

// const primitiveScalarTypeNames = Object.keys(primitiveScalarResolvers);

export const customScalarResolver = (
  scalarType: GraphQLScalarType
): GraphQLFieldResolver<GraphQLScalarType, any> =>
  customScalarResolvers[scalarType.name] || (() => 1);

const customScalarResolvers: {
  [typeName: string]: () => PrimitiveScalarValues;
} = {
  Scalar: () => "AM_SCALAR"
};
