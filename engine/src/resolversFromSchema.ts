import {
  GraphQLFieldResolver,
  GraphQLObjectType,
  GraphQLSchema
} from "graphql";

export default (
  schema: GraphQLSchema
): GraphQLFieldResolver<GraphQLObjectType, any> => (
  _source,
  _args,
  _context,
  _info
) =>
  Object.keys(schema.getTypeMap()).reduce((typeResolvers, type) => {
    return {
      ...typeResolvers
    };
  }, {});

// const leafResolver: FieldResolver<any> = type =>
//   type instanceof GraphQLEnumType ? enumResolver(type) : scalarResolver(type);

// const enumResolver: EnumResolver = type =>
//   type.getValues().reduce(
//     (values: EnumValuesMap, value: GraphQLEnumValue) => ({
//       [value.name]: value.name,
//       ...values
//     }),
//     {}
//   );

// export const scalarResolver: ScalarResolver = type =>
//   primitiveScalarResolvers[type.name] || customScalarResolvers[type.name];

// type JSONScalarValues = null | boolean | number | string;

// const primitiveScalarResolvers: {
//   [typeName: string]: () => JSONScalarValues;
// } = {
//   Boolean: () => true,
//   Float: () => 12.34,
//   ID: () => "ID",
//   Int: () => 1234,
//   String: () => "Hello, World!"
// };

// export const primitiveScalarTypeNames = Object.keys(primitiveScalarResolvers);

// export const customScalarResolver = type =>
//   customScalarResolver[type.name] || (() => 1);

// const customScalarResolvers: {
//   [typeName: string]: () => JSONScalarValues;
// } = {
//   Scalar: () => "AM_SCALAR"
// };
