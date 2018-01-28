import {
  GraphQLAbstractType,
  GraphQLEnumType,
  GraphQLEnumValue,
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

interface Resolvers {
  [typeName: string]: Resolver;
}

type Resolver = GraphQLFieldResolver<any, any> | EnumResolver;

interface EnumResolver {
  [enumValue: string]: string;
}

interface FieldResolvers {
  [fieldName: string]: Resolver;
}

export default (schema: GraphQLSchema): Resolvers =>
  Object.values(schema.getTypeMap()).reduce(attachTypeResolver, {});

const attachTypeResolver = (
  typeResolvers: Resolvers,
  resolveType: GraphQLNamedType
): Resolvers =>
  resolveType instanceof GraphQLObjectType && !resolveType.name.startsWith("__")
    ? {
        [resolveType.name]: Object.values(resolveType.getFields()).reduce(
          attachFieldResolver,
          {}
        ),
        ...typeResolvers
      }
    : typeResolvers;

const attachFieldResolver = (
  fieldResolvers: FieldResolvers,
  field: GraphQLField<any, any>
): FieldResolvers => ({
  [field.name]: resolver(field, field.type),
  ...fieldResolvers
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

const listResolver = (elementResolver: Resolver): Resolver => (
  source,
  args,
  context,
  info
) => [
  isExecutableResolver(elementResolver)
    ? elementResolver(source, args, context, info)
    : elementResolver
];

const isExecutableResolver = (
  typeResolver: Resolver
): typeResolver is GraphQLFieldResolver<any, any> =>
  typeof typeResolver === "function";

const abstractTypeResolver = (
  resolveType: GraphQLAbstractType
): GraphQLFieldResolver<GraphQLAbstractType, any> => () => resolveType.name;

const leafTypeResolver = (resolveType: GraphQLLeafType): Resolver =>
  resolveType instanceof GraphQLEnumType
    ? enumResolver(resolveType)
    : scalarResolver(resolveType) || (() => `<${resolveType.name}>`);

const enumResolver = (enumType: GraphQLEnumType): EnumResolver =>
  enumType.getValues().reduce(attachEnumResolver, {});

const attachEnumResolver = (
  enumValues: EnumResolver,
  value: GraphQLEnumValue
) => ({
  [value.name]: value.value,
  ...enumValues
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

export const customScalarResolver = (
  scalarType: GraphQLScalarType
): GraphQLFieldResolver<GraphQLScalarType, any> =>
  customScalarResolvers[scalarType.name] || (() => 1);

const customScalarResolvers: {
  [typeName: string]: () => PrimitiveScalarValues;
} = {
  Scalar: () => "AM_SCALAR"
};
