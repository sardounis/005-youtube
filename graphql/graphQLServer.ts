import express, { Request, Response, RequestHandler } from "express";
import { GraphQLSchema } from "graphql";
import {
  ApolloServerExpressConfig,
  makeExecutableSchema,
  ApolloServer,
} from "apollo-server-express";
import { CustomContext } from "./context/customContext";
import { resolvers } from "./resolvers/resolvers";

const PORT = 5600;
const app = express();

const schemas: string = "type Query{p:Test} type Test { id: Int!}";
const services: any = {};
const config: ApolloServerExpressConfig = {
  schema: makeExecutableSchema({
    typeDefs: schemas,
    resolvers: resolvers,
  }),
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