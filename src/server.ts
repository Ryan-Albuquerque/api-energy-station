import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server";
import { DatabaseConnect } from "./database/database.mongo";

//GraphTypes
import { UserGQL } from "./modules/users/user.graphql";

//Resolvers
import { userModule } from "./modules/users/main";

DatabaseConnect(process.env.DB_URI ?? "");

// Tipos do GraphQL
const typeDefs = [UserGQL];
// Resolvers
const resolvers = {
  Query: {
    ...userModule.Query,
  },
  Mutation: {
    ...userModule.Mutation,
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
