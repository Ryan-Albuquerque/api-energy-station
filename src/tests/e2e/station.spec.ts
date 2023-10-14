import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "apollo-server";
import {
  DatabaseConnect,
  DatabaseDisconnect,
} from "../../database/database.mongo";
import { stationModule } from "../../modules/stations/main";
import { StationGQL } from "../../modules/stations/station.graphql";
import { installStationMutation } from "./mocks/station.mock";
import { StationModel } from "../../modules/stations/model/station.model";
import { PlanetModel } from "../../modules/planets/model/planet.model";
import { suitablePlanets } from "./mocks/data/suitablePlanets.mock";

const typeDefs = [StationGQL];

const resolvers = {
  Query: {
    ...stationModule.Query,
  },
  Mutation: {
    ...stationModule.Mutation,
  },
};

const testServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const stationData = {
  station: {
    planetName: "11 Com b",
    name: "ryan station",
  },
};

beforeAll(async () => {
  await DatabaseConnect(process.env.DB_URI_TEST ?? "");

  await StationModel.deleteMany({}).exec();
  await PlanetModel.insertMany(suitablePlanets);
});

afterAll(async () => {
  await StationModel.deleteMany({}).exec();
  await PlanetModel.deleteMany({}).exec();
  await DatabaseDisconnect();
});

describe("E2E - Station", () => {
  describe("Mutation - InstallStation", () => {
    it("should create station with success", async () => {
      const response = await testServer.executeOperation({
        query: installStationMutation,
        variables: stationData,
      });

      expect(response.data).toHaveProperty("installStation");
      expect(response?.data?.installStation).toHaveProperty("_id");
      expect(response?.data?.installStation).toHaveProperty("createdAt");
      expect(response?.data?.installStation).toHaveProperty("updatedAt");
      expect(response?.data?.installStation).toHaveProperty("name");
      expect(response?.data?.installStation).toHaveProperty("planetName");
      expect(response?.data?.installStation.name).toBe(
        stationData.station.name
      );
      expect(response?.data?.installStation.planetName).toBe(
        stationData.station.planetName
      );
    });
  });
});
