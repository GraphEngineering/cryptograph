export { default as PeopleAndDogs } from "./PeopleAndDogs";

export const jsonToResolvers = (schemaJson: any): object => {
  const externalTypes = schemaJson.data.__schema.types.filter(
    ({ name, kind }: any) => !name.startsWith("__") && kind == "OBJECT"
  );

  const typeResolvers = externalTypes.reduce(
    (resolvers: any, type: any) => ({
      [type.name]: typeToResolver(type),
      ...resolvers
    }),
    {}
  );

  return { ...typeResolvers };

  //   (name: string): ((id: any) => any) =>
  //   nameToTypeResolver(name)
  // );
};

const typeToResolver = (type: any) => ({ message: () => "Hello, World!" });
