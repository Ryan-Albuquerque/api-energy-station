import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server";
import { DatabaseConnect } from "./database/database.mongo";

//GraphTypes
import { UserGQL } from "./modules/users/user.graphql";
import { PlanetType } from "./modules/planets/planet.graphql";

//Resolvers
import { userModule } from "./modules/users/main";
import { planetModule } from "./modules/planets/main";

DatabaseConnect(process.env.DB_URI ?? "");

// Tipos do GraphQL
const typeDefs = [UserGQL, PlanetType];
// Resolvers
const resolvers = {
  Query: {
    ...userModule.Query,
    ...planetModule.Query,
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
