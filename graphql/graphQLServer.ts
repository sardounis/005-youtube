import express, { Request, Response, RequestHandler } from "express";
import { GraphQLSchema } from "graphql";
import {
  ApolloServerExpressConfig,
  makeExecutableSchema,
  ApolloServer,
} from "apollo-server-express";

// import { mergeTypes, fileLoader } from "merge-graphql-schemas";

import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

import { CustomContext } from "./context/customContext";
// import { resolvers } from "./resolvers/resolvers";
import path from 'path';

const PORT = 5600;
const app = express();

// const schemas: string = "type Query{p:Test} type Test { id: Int!}";

const resolverPath = path.join(__dirname, "./resolvers");
const allResolvers = loadFilesSync(resolverPath);
const mergedResolvers = mergeResolvers(allResolvers);

const schemasPath = loadFilesSync(
  path.join(__dirname, "./schemas/*.graphql")
);

const schemas = mergeTypeDefs(schemasPath);
const services: any = {};

const config: ApolloServerExpressConfig = {
  typeDefs: schemas,
  resolvers: mergedResolvers,
  dataSources: () => {
    return services as any;
  },
  context: (context: CustomContext) => {
    // context.loaders = new DataLoaders(services);
    return context;
  },
  playground: true,
  introspection: true,
  tracing: true,
};

const server = new ApolloServer(config);
server.applyMiddleware({ app, path: "/graphql", cors: true });

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is up");
});

app.listen(PORT, () => {
  console.log("Listening...");
});