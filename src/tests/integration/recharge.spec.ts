import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "apollo-server";
import { rechargeModule } from "../../modules/recharges/main";
import { RechargeGQL } from "../../modules/recharges/recharge.graphql";
import { listHistoryFromAStation, recharge } from "./mocks/recharge.mock";
import { faker } from "@faker-js/faker";
import { UserModel } from "../../modules/users/model/user.model";
import {
  DatabaseConnect,
  DatabaseDisconnect,
} from "../../database/database.mongo";
import { RechargeModel } from "../../modules/recharges/model/recharge.model";
import { StationModel } from "../../modules/stations/model/station.model";
import { ReservationModel } from "../../modules/reservation/model/reservation.model";

const typeDefs = [RechargeGQL];

const resolvers = {
  Query: {
    ...rechargeModule.Query,
  },
  Mutation: {
    ...rechargeModule.Mutation,
  },
};

const testServer = new ApolloServer({
  typeDefs,
  resolvers,
});

beforeAll(async () => {
  const uri = process.env.DB_URI_TEST || "";
  await DatabaseConnect(uri);

  await UserModel.deleteMany({}).exec();
  await StationModel.deleteMany({}).exec();

  await UserModel.insertMany([
    {
      email: "test@test.com",
      name: "test",
      password: "123456789",
    },
    {
      email: "test2@test.com",
      name: "test2",
      password: "123456789",
    },
  ]);

  await StationModel.insertMany([
    {
      planetName: "11 Com b",
      name: "test",
    },
    {
      planetName: "18 Del b",
      name: "test2",
    },
  ]);
});

afterAll(async () => {
  await UserModel.deleteMany({}).exec();
  await StationModel.deleteMany({}).exec();
  await RechargeModel.deleteMany({}).exec();

  await DatabaseDisconnect();
});

describe("INTEGRATION - Recharge", () => {
  describe("Create Recharge", () => {
    describe("Success", () => {
      it("should create recharge", async () => {
        //Arrange
        const endDate = faker.date.soon({ refDate: new Date() });
        const variables = {
          recharge: {
            stationName: "test",
            userEmail: "test@test.com",
            endDate,
          },
        };

        //Act
        const response = await testServer.executeOperation({
          query: recharge,
          variables,
        });

        //Assert

        expect(response.data?.recharge).toBeDefined();
        expect(response.data?.recharge?.userEmail).toEqual(
          variables.recharge.userEmail
        );
        expect(response.data?.recharge?.stationName).toEqual(
          variables.recharge.stationName
        );

        await RechargeModel.deleteMany({}).exec();
      });
    });
    describe("Fails", () => {
      it("should fail because now is greater than endDate", async () => {
        //Arrange
        const endDate = faker.date.past();
        const variables = {
          recharge: {
            stationName: "test",
            userEmail: "test@test.com",
            endDate,
          },
        };

        //Act
        const response = await testServer.executeOperation({
          query: recharge,
          variables,
        });

        //Assert

        expect(response.data?.recharge).toBeFalsy();
        expect(response.errors?.[0].message).toEqual(
          "Informed endDate is invalid, should be greater than now"
        );
      });
      it("should fail because user is invalid", async () => {
        //Arrange
        const endDate = faker.date.soon({ refDate: new Date() });
        const variables = {
          recharge: {
            stationName: "test",
            userEmail: "test_@test.com",
            endDate,
          },
        };

        //Act
        const response = await testServer.executeOperation({
          query: recharge,
          variables,
        });

        //Assert

        expect(response.data?.recharge).toBeFalsy();
        expect(response.errors?.[0].message).toEqual(
          "User not found with email test_@test.com"
        );
      });
      it("should fail because station is invalid", async () => {
        //Arrange
        const endDate = faker.date.soon({ refDate: new Date() });
        const variables = {
          recharge: {
            stationName: "test_",
            userEmail: "test@test.com",
            endDate,
          },
        };

        //Act
        const response = await testServer.executeOperation({
          query: recharge,
          variables,
        });

        //Assert

        expect(response.data?.recharge).toBeFalsy();
        expect(response.errors?.[0].message).toEqual(
          "Invalid Station, try listStation to see available station"
        );
      });
      it("should fail because station is in use", async () => {
        //Arrange
        const startDate = new Date();
        const endDate = faker.date.soon({ refDate: startDate });
        const rechargeData = {
          recharge: {
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
          },
        };
        await RechargeModel.create({
          endDate,
          stationName: "test",
          userEmail: "test2@test.com",
          startDate,
        });
        //Act
        const response = await testServer.executeOperation({
          query: recharge,
          variables: rechargeData,
        });
        //Assert
        expect(response.data?.recharge).toBeFalsy();
        expect(response?.errors?.[0].message).toEqual(
          "Station in use or user already recharding"
        );

        await RechargeModel.deleteMany({}).exec();
      });
      it("should fail because user is already recharding", async () => {
        //Arrange
        const startDate = new Date();
        const endDate = faker.date.soon({ refDate: startDate });
        const rechargeData = {
          recharge: {
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
          },
        };
        await RechargeModel.create({
          endDate,
          stationName: "test2",
          userEmail: "test@test.com",
          startDate,
        });
        //Act
        const response = await testServer.executeOperation({
          query: recharge,
          variables: rechargeData,
        });
        //Assert
        expect(response.data?.recharge).toBeFalsy();
        expect(response?.errors?.[0].message).toEqual(
          "Station in use or user already recharding"
        );

        await RechargeModel.deleteMany({}).exec();
      });
      it("should fail because station is reserved in this range", async () => {
        //Arrange
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const rechargeData = {
          recharge: {
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
          },
        };
        await ReservationModel.create({
          startDate,
          endDate,
          stationName: "test",
          userEmail: "test2@test.com",
        });
        //Act
        const response = await testServer.executeOperation({
          query: recharge,
          variables: rechargeData,
        });
        //Assert
        expect(response.data?.recharge).toBeFalsy();
        expect(response?.errors?.[0].message).toBe(
          "This is station have a non-trigged recharge reservation for this range, try again later"
        );
        await ReservationModel.deleteMany({}).exec();
      });
    });
  });

  describe("List Recharge History", () => {
    describe("Success", () => {
      it("should list recharge history", async () => {
        //Arrange
        const now = new Date();
        const recent = faker.date.recent();
        const endDate = faker.date.soon({ refDate: now });

        await RechargeModel.insertMany([
          {
            stationName: "test",
            userEmail: "test@test.com",
            endDate,
            startDate: now,
            totalTime: (
              (endDate.getTime() - now.getTime()) /
              1000 /
              60 /
              60
            ).toFixed(3),
          },
          {
            stationName: "test",
            userEmail: "test2@test.com",
            endDate,
            startDate: recent,
            totalTime: (
              (endDate.getTime() - recent.getTime()) /
              1000 /
              60 /
              60
            ).toFixed(3),
          },
        ]);

        //Act
        const response = await testServer.executeOperation({
          query: listHistoryFromAStation,
          variables: {
            stationName: "test",
          },
        });

        //Assert

        expect(response.data?.rechargeStationHistory).toBeDefined();

        await RechargeModel.deleteMany({}).exec();
      });
    });
  });
});
