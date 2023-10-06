import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server";
import { DatabaseConnect } from "./database/database.mongo";

//GraphTypes
import { UserGQL } from "./modules/users/user.graphql";
import { PlanetGQL } from "./modules/planets/planet.graphql";
import { StationGQL } from "./modules/stations/station.graphql";
import { RechargeGQL } from "./modules/recharges/recharge.graphql";
import { ReservationGQL } from "./modules/reservation/reservation.graphql";

//Resolvers
import { userModule } from "./modules/users/main";
import { planetModule } from "./modules/planets/main";
import { stationModule } from "./modules/stations/main";
import { rechargeModule } from "./modules/recharges/main";
import { reservationModule } from "./modules/reservation/main";
import { DateScalar } from "./utils/gql.scalar";
import { makeExecutableSchema } from "@graphql-tools/schema";

DatabaseConnect(process.env.DB_URI ?? "");

// Tipos do GraphQL
const typeDefs = [UserGQL, PlanetGQL, StationGQL, RechargeGQL, ReservationGQL];

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
  },
};

// Inicializando o Apollo Server
const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
});

// Iniciar o servidor
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
