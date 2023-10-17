import { RechargeModel } from "../model/recharge.model";
import { mockModel } from "../../../tests/utils/mock-model";
import { RechargeRepository } from "../repository/recharge.repository";
import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { FixtureRechargeEntity } from "./mocks/data/fixture.main";
import { ReservationModel } from "../../reservation/model/reservation.model";
import { FixtureReservationEntity } from "../../reservation/tests/mocks/data/fixture.main";

const rechargeModelMock = mockModel;
const reservationModelMock = mockModel;

const rechargeRepository = new RechargeRepository(
  rechargeModelMock as unknown as typeof RechargeModel,
  reservationModelMock as unknown as typeof ReservationModel
);

const createRechargeMock = new CreateRechargeDTO(FixtureRechargeEntity);

beforeEach(() => jest.resetAllMocks());

describe("RechargeRepository", () => {
  describe("create", () => {
    it("should create with successful", async () => {
      // Arrange
      jest
        .spyOn(rechargeModelMock, "create")
        .mockImplementationOnce(() => Promise.resolve(FixtureRechargeEntity));
      //Act
      const response = await rechargeRepository.create(createRechargeMock);

      //Assert
      expect(response).toEqual(FixtureRechargeEntity);
    });
  });
  describe("listReservationByStationName", () => {
    it("should list reservations by station name with successful", async () => {
      // Arrange
      const station = "test";
      const reservationWithPreviousStation = {
        ...FixtureReservationEntity,
        stationName: station,
      };
      jest
        .spyOn(reservationModelMock, "find")
        .mockImplementationOnce(() =>
          Promise.resolve(new Array(10).fill(reservationWithPreviousStation))
        );
      //Act
      const response = await rechargeRepository.listReservationByStationName(
        station
      );

      //Assert
      response.forEach((res) => expect(res.stationName).toEqual(station));
    });
  });
  describe("getById", () => {
    it("should getById with successful", async () => {
      // Arrange
      jest
        .spyOn(rechargeModelMock, "findById")
        .mockImplementationOnce(() => Promise.resolve(FixtureRechargeEntity));
      //Act
      const response = await rechargeRepository.getById(
        FixtureRechargeEntity._id.toString()
      );

      //Assert
      expect(response).toEqual(FixtureRechargeEntity);
      expect(response?.userEmail).toEqual(FixtureRechargeEntity.userEmail);
    });
  });
  describe("list", () => {
    it("should list with successful", async () => {
      // Arrange
      const rechargeList = new Array(10).fill(FixtureRechargeEntity);
      jest
        .spyOn(rechargeModelMock, "find")
        .mockImplementationOnce(() => Promise.resolve(rechargeList));
      //Act
      const response = await rechargeRepository.list();

      //Assert
      expect(response).toEqual(rechargeList);
    });
  });

  describe("listByStationName", () => {
    it("should list By StationName with successful", async () => {
      // Arrange
      const station = "test";
      const rechargeWithPreviousStation = {
        ...FixtureRechargeEntity,
        stationName: station,
      };
      jest
        .spyOn(rechargeModelMock, "find")
        .mockImplementationOnce(() =>
          Promise.resolve(new Array(10).fill(rechargeWithPreviousStation))
        );
      //Act
      const response = await rechargeRepository.listByStationName(station);

      //Assert
      response.forEach((rec) => expect(rec.stationName).toEqual(station));
    });
  });
});
