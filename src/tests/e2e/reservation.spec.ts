import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "apollo-server";
import {
  DatabaseConnect,
  DatabaseDisconnect,
} from "../../database/database.mongo";
import { reservationModule } from "../../modules/reservation/main";
import { ReservationGQL } from "../../modules/reservation/reservation.graphql";
import { reservation } from "./mocks/reservation.mock";
import { ReservationModel } from "../../modules/reservation/model/reservation.model";
import { faker } from "@faker-js/faker";
import { StationModel } from "../../modules/stations/model/station.model";

const typeDefs = [ReservationGQL];

const resolvers = {
  Query: {
    ...reservationModule.Query,
  },
  Mutation: {
    ...reservationModule.Mutation,
  },
};

const testServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startDate = faker.date.soon();
const endDate = faker.date.soon({ refDate: startDate });
const reservationData = {
  reservation: {
    startDate,
    endDate,
    stationName: "ryan station",
    userEmail: "ryan@gmail.com",
  },
};

beforeAll(async () => {
  await DatabaseConnect(process.env.DB_URI_TEST ?? "");

  await ReservationModel.deleteMany({}).exec();
  await StationModel.create({
    planetName: "11 Com b",
    name: "ryan station",
  });
});

afterAll(async () => {
  await ReservationModel.deleteMany({}).exec();
  await StationModel.deleteMany({}).exec();
  await DatabaseDisconnect();
});

describe("E2E - Reservation", () => {
  describe("Mutation - Reservation", () => {
    it("should create reservation with success", async () => {
      const response = await testServer.executeOperation({
        query: reservation,
        variables: reservationData,
      });

      expect(response.data).toHaveProperty("reservation");
      expect(response?.data?.reservation.userEmail).toBe(
        reservationData.reservation.userEmail
      );
      expect(response?.data?.reservation.stationName).toBe(
        reservationData.reservation.stationName
      );
    });
  });
});
