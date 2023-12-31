import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "apollo-server";
import {
  DatabaseConnect,
  DatabaseDisconnect,
} from "../../database/database.mongo";
import { planetModule } from "../../modules/planets/main";
import { PlanetGQL } from "../../modules/planets/planet.graphql";
import { planetQuery } from "./mocks/planet.mock";
import { PlanetModel } from "../../modules/planets/model/planet.model";

const typeDefs = [PlanetGQL];

const resolvers = {
  Query: {
    ...planetModule.Query,
  },
};

const testServer = new ApolloServer({
  typeDefs,
  resolvers,
});

beforeAll(async () => {
  const uri = process.env.DB_URI_TEST || "";

  await DatabaseConnect(uri);

  await PlanetModel.deleteMany({}).exec();
});

afterAll(async () => {
  await PlanetModel.deleteMany({}).exec();
  await DatabaseDisconnect();
});

describe("INTEGRATION - Planet", () => {
  describe("Query - SuitablePlanet", () => {
    it("should all suitable planets with success", async () => {
      const response = await testServer.executeOperation({
        query: planetQuery,
      });

      expect(response.data).toHaveProperty("suitablePlanets");
    });
  });
});
