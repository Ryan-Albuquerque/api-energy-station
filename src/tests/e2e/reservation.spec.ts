import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "apollo-server";
import { reservationModule } from "../../modules/reservation/main";
import { ReservationGQL } from "../../modules/reservation/reservation.graphql";
import {
  reservation,
  triggerReservation,
  activeReservation,
  listReservations,
} from "./mocks/reservation.mock";
import { faker } from "@faker-js/faker";
import { UserModel } from "../../modules/users/model/user.model";
import {
  DatabaseConnect,
  DatabaseDisconnect,
} from "../../database/database.mongo";
import { ReservationModel } from "../../modules/reservation/model/reservation.model";
import { StationModel } from "../../modules/stations/model/station.model";
import { RechargeModel } from "../../modules/recharges/model/recharge.model";
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
  const uri = process.env.DB_URI_TEST || "";
  await DatabaseConnect(uri);

  await UserModel.deleteMany({}).exec();
  await RechargeModel.deleteMany({}).exec();
  await ReservationModel.deleteMany({}).exec();
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
  await ReservationModel.deleteMany({}).exec();
  await RechargeModel.deleteMany({}).exec();
  await StationModel.deleteMany({}).exec();

  await DatabaseDisconnect();
});

describe("E2E - Reservation", () => {
  describe("Create Reservation", () => {
    describe("Success", () => {
      it("should create reservation", async () => {
        //Arrange
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const variables = {
          reservation: {
            stationName: "test",
            userEmail: "test@test.com",
            endDate,
            startDate,
          },
        };

        //Act
        const response = await testServer.executeOperation({
          query: reservation,
          variables,
        });

        //Assert

        expect(response.data?.reservation).toBeDefined();
        expect(response.data?.reservation?.userEmail).toEqual(
          variables.reservation.userEmail
        );
        expect(response.data?.reservation?.stationName).toEqual(
          variables.reservation.stationName
        );
        await ReservationModel.deleteMany({}).exec();
      });
    });
    describe("Fail", () => {
      it("should fail because endDate is greater than startDate", async () => {
        //Arrange
        const startDate = faker.date.past();
        const endDate = faker.date.past({ refDate: startDate });
        const variables = {
          reservation: {
            stationName: "test",
            userEmail: "test@test.com",
            endDate,
            startDate,
          },
        };

        //Act
        const response = await testServer.executeOperation({
          query: reservation,
          variables,
        });

        //Assert

        expect(response.data?.reservation).toBeFalsy();
        expect(response.errors?.[0].message).toEqual(
          "End date should be greater than start Date and/or dates should be greater than now"
        );
      });
      it("should fail because reservation range is in the past", async () => {
        //Arrange
        const endDate = faker.date.past();
        const startDate = faker.date.past({ refDate: endDate });
        const variables = {
          reservation: {
            stationName: "test",
            userEmail: "test@test.com",
            endDate,
            startDate,
          },
        };

        //Act
        const response = await testServer.executeOperation({
          query: reservation,
          variables,
        });

        //Assert

        expect(response.data?.reservation).toBeFalsy();
        expect(response.errors?.[0].message).toEqual(
          "End date should be greater than start Date and/or dates should be greater than now"
        );
      });
      it("should fail because station is already reserved previously", async () => {
        //Arrange
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
          },
        };

        await ReservationModel.create({
          endDate: faker.date.soon({ refDate: endDate }),
          startDate: faker.date.recent(),
          stationName: "test",
          userEmail: "test@test.com",
        });

        //Act

        const response = await testServer.executeOperation({
          query: reservation,
          variables: reservationData,
        });

        //Assert
        expect(response.data?.reservation).toBeFalsy();
        expect(response?.errors?.[0].message).toEqual(
          "This range is not valid for this station: " +
            reservationData.reservation.stationName +
            "\n or user already have reservation for this time"
        );
        await ReservationModel.deleteMany({}).exec();
      });
      it("should fail because station is in use recharging", async () => {
        //Arrange
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
          },
        };

        await RechargeModel.create({
          endDate,
          startDate: faker.date.recent(),
          stationName: "test",
          userEmail: "test2@test.com",
        });

        //Act

        const response = await testServer.executeOperation({
          query: reservation,
          variables: reservationData,
        });

        //Assert
        expect(response.data?.reservation).toBeFalsy();
        expect(response?.errors?.[0].message).toEqual(
          "This range is not valid for this station: " +
            reservationData.reservation.stationName +
            "\n or user already have reservation for this time"
        );
        await RechargeModel.deleteMany({}).exec();
      });
      it("should fail because user is recharging in the reservation range", async () => {
        //Arrange
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test2",
            userEmail: "test@test.com",
          },
        };

        await RechargeModel.create({
          endDate,
          startDate: faker.date.recent(),
          stationName: "test",
          userEmail: "test@test.com",
        });

        //Act

        const response = await testServer.executeOperation({
          query: reservation,
          variables: reservationData,
        });

        //Assert
        expect(response.data?.reservation).toBeFalsy();
        expect(response?.errors?.[0].message).toEqual(
          "This range is not valid for this station: " +
            reservationData.reservation.stationName +
            "\n or user already have reservation for this time"
        );
        await RechargeModel.deleteMany({}).exec();
      });
    });
  });

  describe("Trigger Reservation", () => {
    describe("Success", () => {
      it("should trigger reservation and create recharge with success", async () => {
        const startDate = new Date();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
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
      it("should fail because reservation not found", async () => {
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
      it("should fail because reservation is already trigged", async () => {
        const startDate = faker.date.soon();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
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
      it("should fail because it is not time to start the reservation recharge", async () => {
        const startDate = faker.date.future();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
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
      it("should fail because passed the reservation time", async () => {
        const endDate = faker.date.past();
        const startDate = faker.date.past({ refDate: endDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
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
      it("should fail because station is in use", async () => {
        const startDate = new Date();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
          },
        };

        await RechargeModel.create({
          endDate,
          startDate: faker.date.recent(),
          stationName: "test",
          userEmail: "test2@test.com",
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
      it("should fail because user is recharging", async () => {
        const startDate = new Date();
        const endDate = faker.date.soon({ refDate: startDate });
        const reservationData = {
          reservation: {
            startDate,
            endDate,
            stationName: "test",
            userEmail: "test@test.com",
          },
        };

        await RechargeModel.create({
          endDate,
          startDate: faker.date.recent(),
          stationName: "test2",
          userEmail: "test@test.com",
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

  describe("Active reservation", () => {
    describe("Success", () => {
      it("should return active reservations", async () => {
        //Arrange
        const soon = faker.date.soon();
        const past = faker.date.past();

        await ReservationModel.insertMany([
          {
            stationName: "test",
            userEmail: "test@test.com",
            endDate: faker.date.soon({ refDate: soon }),
            startDate: soon,
          },
          {
            stationName: "test",
            userEmail: "test@test.com",
            endDate: past,
            startDate: faker.date.past({ refDate: past }),
          },
        ]);

        //Act
        const response = await testServer.executeOperation({
          query: activeReservation,
        });

        //Assert

        expect(response.data?.listActiveReservations).toBeDefined();
        expect(response.data?.listActiveReservations.length).toEqual(1);

        await ReservationModel.deleteMany({}).exec();
      });
    });
  });
  describe("List reservation", () => {
    describe("Success", () => {
      it("should return reservations", async () => {
        //Arrange
        const soon = faker.date.soon();
        const past = faker.date.past();

        await ReservationModel.insertMany([
          {
            stationName: "test",
            userEmail: "test@test.com",
            endDate: faker.date.soon({ refDate: soon }),
            startDate: soon,
          },
          {
            stationName: "test",
            userEmail: "test@test.com",
            endDate: past,
            startDate: faker.date.past({ refDate: past }),
          },
        ]);

        //Act
        const response = await testServer.executeOperation({
          query: listReservations,
        });

        //Assert

        expect(response.data?.listReservations).toBeDefined();
        expect(response.data?.listReservations.length).toEqual(2);

        await ReservationModel.deleteMany({}).exec();
      });
    });
  });
});
