import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "apollo-server";
import {
  DatabaseConnect,
  DatabaseDisconnect,
} from "../../database/database.mongo";
import { reservationModule } from "../../modules/reservation/main";
import { ReservationGQL } from "../../modules/reservation/reservation.graphql";
import { reservation, triggerReservation } from "./mocks/reservation.mock";
import { ReservationModel } from "../../modules/reservation/model/reservation.model";
import { faker } from "@faker-js/faker";
import { StationModel } from "../../modules/stations/model/station.model";
import { RechargeModel } from "../../modules/recharges/model/recharge.model";
import { ReservationRepository } from "../../modules/reservation/repository/reservation.repository";
import { ReservationEntity } from "../../modules/reservation/reservation.entity";
import { UserModel } from "../../modules/users/model/user.model";
import { ValidObjectId } from "../utils/valid-resources";

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

beforeAll(async () => {
  await DatabaseConnect(process.env.DB_URI_TEST ?? "");

  await ReservationModel.deleteMany({}).exec();
  await UserModel.create({
    email: "test@gmail.com",
    name: "test",
    password: "123456789",
  });
  await StationModel.create({
    planetName: "11 Com b",
    name: "test station",
  });
});

afterAll(async () => {
  await ReservationModel.deleteMany({}).exec();
  await RechargeModel.deleteMany({}).exec();
  await StationModel.deleteMany({}).exec();
  await UserModel.deleteMany({}).exec();
  await DatabaseDisconnect();
});

describe("E2E - Reservation", () => {
  describe("Mutation - Reservation", () => {
    describe("Sucess", () => {
      it("should create reservation", async () => {
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
          },
        };

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
    describe("Fail", () => {
      it("should create reservation but fail because startDate is greater than endDate", async () => {
        const endDate = faker.date.soon();
        const startDate = faker.date.soon({ refDate: endDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
          },
        };

        const response = await testServer.executeOperation({
          query: reservation,
          variables: reservationData,
        });

        expect(response.data).toBeNull();
        expect(response?.errors).toBeTruthy();
        expect(response?.errors?.[0].message).toBe(
          "End date should be greater than start Date and/or dates should be greater than now"
        );
      });
      it("should create reservation but fail because already have reservation in this range", async () => {
        //Arrange
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
          },
        };

        await ReservationModel.create({ ...reservationData.reservation });

        //Act

        const response = await testServer.executeOperation({
          query: reservation,
          variables: reservationData,
        });

        //Assert

        expect(response.data).toBeNull();
        expect(response?.errors).toBeTruthy();
        expect(response?.errors?.[0].message).toBe(
          "This range is not valid for this station: " +
            reservationData.reservation.stationName +
            "\n or user already have reservation for this time"
        );
        await ReservationModel.deleteMany({}).exec();
      });
      it("should create reservation but fail because already have recharge in this range", async () => {
        //Arrange
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
          },
        };

        await RechargeModel.create({
          endDate,
          startDate: faker.date.recent(),
          stationName: "test station",
          userEmail: "test@gmail.com",
        });

        //Act

        const response = await testServer.executeOperation({
          query: reservation,
          variables: reservationData,
        });

        //Assert

        expect(response.data).toBeNull();
        expect(response?.errors).toBeTruthy();
        expect(response?.errors?.[0].message).toBe(
          "This range is not valid for this station: " +
            reservationData.reservation.stationName +
            "\n or user already have reservation for this time"
        );
        await RechargeModel.deleteMany({}).exec();
      });
      it("should create reservation but fail because fail to create reservation", async () => {
        //Arrange
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
          },
        };

        jest
          .spyOn(ReservationRepository.prototype, "create")
          .mockImplementationOnce(() =>
            Promise.resolve(null as unknown as ReservationEntity)
          );

        //Act

        const response = await testServer.executeOperation({
          query: reservation,
          variables: reservationData,
        });

        //Assert

        expect(response.data).toBeNull();
        expect(response?.errors).toBeTruthy();
        expect(response?.errors?.[0].message).toBe(
          "Fail to create reservation"
        );
      });
    });
  });

  describe("Mutation - TriggerReservation", () => {
    describe("Success", () => {
      it("should trigger reservation with success", async () => {
        const startDate = new Date();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
          },
        };

        const reservationCreated = await ReservationModel.create({
          ...reservationData.reservation,
        });

        const response = await testServer.executeOperation({
          query: triggerReservation,
          variables: {
            triggerReservationId: reservationCreated._id.toString(),
          },
        });

        expect(response.data).toHaveProperty("triggerReservation");

        await ReservationModel.deleteMany({}).exec();
      });
    });
    describe("Fail", () => {
      it("should fail because reservation not exist", async () => {
        const response = await testServer.executeOperation({
          query: triggerReservation,
          variables: {
            triggerReservationId: ValidObjectId[0],
          },
        });

        expect(response?.errors?.[0].message).toBe(
          "Reservation not found or already trigged"
        );
      });
      it("should fail because reservation already trigged", async () => {
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
            isTrigged: true,
          },
        };

        const reservationCreated = await ReservationModel.create({
          ...reservationData.reservation,
        });

        const response = await testServer.executeOperation({
          query: triggerReservation,
          variables: {
            triggerReservationId: reservationCreated._id.toString(),
          },
        });

        expect(response?.errors?.[0].message).toBe(
          "Reservation not found or already trigged"
        );
        await ReservationModel.deleteMany({}).exec();
      });

      it("should fail because reservation is not able to trigged", async () => {
        const startDate = faker.date.future();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
          },
        };

        const reservationCreated = await ReservationModel.create({
          ...reservationData.reservation,
        });

        const response = await testServer.executeOperation({
          query: triggerReservation,
          variables: {
            triggerReservationId: reservationCreated._id.toString(),
          },
        });

        expect(response?.errors?.[0].message).toBe(
          "Reservation is not able to start recharge"
        );
        await ReservationModel.deleteMany({}).exec();
      });
      it("should fail because user is recharging or Station is in use", async () => {
        const startDate = new Date();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test station",
            userEmail: "test@gmail.com",
          },
        };

        await RechargeModel.create({
          endDate,
          startDate: faker.date.recent(),
          stationName: "test station",
          userEmail: "test@gmail.com",
        });

        const reservationCreated = await ReservationModel.create({
          ...reservationData.reservation,
        });

        const response = await testServer.executeOperation({
          query: triggerReservation,
          variables: {
            triggerReservationId: reservationCreated._id.toString(),
          },
        });

        expect(response?.errors?.[0].message).toBe(
          "User is recharging or Station is in use"
        );
        await ReservationModel.deleteMany({}).exec();
        await RechargeModel.deleteMany({}).exec();
      });
    });
  });
});
