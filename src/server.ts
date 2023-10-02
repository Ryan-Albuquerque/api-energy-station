import dotenv from "dotenv";
dotenv.config();

import { ApolloServer, gql } from "apollo-server";
import { DatabaseConnect } from "./database/database.mongo";

DatabaseConnect(process.env.DB_URI ?? "");

// Tipos do GraphQL
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => "Hello, world!",
  },
};

// Inicializando o Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Iniciar o servidor
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
