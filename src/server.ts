import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server";
import { DatabaseConnect } from "./database/database.mongo";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { shield, allow } from "graphql-shield";

//GraphTypes
import { DateScalar } from "./utils/gql.scalar";
import { UserGQL } from "./modules/users/user.graphql";
import { PlanetGQL } from "./modules/planets/planet.graphql";
import { StationGQL } from "./modules/stations/station.graphql";
import { RechargeGQL } from "./modules/recharges/recharge.graphql";
import { ReservationGQL } from "./modules/reservation/reservation.graphql";
import { AuthGQL } from "./modules/auth/auth.graphql";

//Modules
import { authModule } from "./modules/auth/main";
import { userModule } from "./modules/users/main";
import { planetModule } from "./modules/planets/main";
import { stationModule } from "./modules/stations/main";
import { rechargeModule } from "./modules/recharges/main";
import { reservationModule } from "./modules/reservation/main";

DatabaseConnect(process.env.DB_URI ?? "");

// Tipos do GraphQL
const typeDefs = [
  UserGQL,
  PlanetGQL,
  StationGQL,
  RechargeGQL,
  ReservationGQL,
  AuthGQL,
];

// Resolvers
const resolvers = {
  Date: DateScalar,
  Query: {
    ...userModule.Query,
    ...planetModule.Query,
    ...stationModule.Query,
    ...rechargeModule.Query,
    ...reservationModule.Query,
  },
  Mutation: {
    ...reservationModule.Mutation,
    ...userModule.Mutation,
    ...stationModule.Mutation,
    ...rechargeModule.Mutation,
    ...authModule.Mutation,
  },
};

//middlewares
const schemaWithMiddleware = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  shield({
    Query: {
      "*": authModule.authenticationMiddleware.auth(),
    },
    Mutation: {
      createUser: allow,
      login: allow,
      "*": authModule.authenticationMiddleware.auth(),
    },
  })
);

// Inicializando o Apollo Server
const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: ({ req }) => ({ req }),
});

// Iniciar o servidor
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
