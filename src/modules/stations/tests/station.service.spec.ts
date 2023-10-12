import { mockStationRepository } from "./mocks/mock-station.repository";
import { FixtureStationEntity } from "./mocks/data/fixture.main";
import { StationService } from "../services/station.service";
import { CreateStationDTO } from "../dtos/create-station.dto";
import { UpdateStationDTO } from "../dtos/update-station.dto";
import { StationEntity } from "../station.entity";

const stationService = new StationService(mockStationRepository);

const createStationMock = new CreateStationDTO(FixtureStationEntity);
const updateStationMock = new UpdateStationDTO(FixtureStationEntity);

beforeEach(() => jest.resetAllMocks());

describe("StationService", () => {
  describe("Create", () => {
    it("should not create because already exist", async () => {
      // Arrange

      //Act

      //Assert
      await expect(stationService.create(createStationMock)).rejects.toThrow(
        "Should be unique planet - and registered in database - and station name"
      );
    });
    it("should create with successful", async () => {
      // Arrange
      jest
        .spyOn(mockStationRepository, "list")
        .mockImplementationOnce(() => Promise.resolve([]));
      //Act
      const response = await stationService.create(createStationMock);

      //Assert
      expect(response).toEqual(FixtureStationEntity);
    });

    it("should create with success when already exist stations", async () => {
      // Arrange
      jest
        .spyOn(mockStationRepository, "list")
        .mockImplementationOnce(() =>
          Promise.resolve([
            { ...FixtureStationEntity, name: "name", planetName: "planet" },
          ])
        );
      //Act
      const response = await stationService.create(createStationMock);

      //Assert
      expect(response).toEqual(FixtureStationEntity);
    });
  });
  describe("Update", () => {
    it("should update with successful", async () => {
      // Arrange

      //Act
      const response = await stationService.update(
        FixtureStationEntity._id.toString(),
        updateStationMock
      );

      //Assert
      expect(response).toEqual(FixtureStationEntity);
    });

    it("should throw `invalid id` exception when id is invalid", async () => {
      // Arrange

      //Act

      //Assert
      await expect(
        stationService.update("objectId", updateStationMock)
      ).rejects.toThrow(`Invalid Id`);
    });

    it("should throw `fail to update` exception when update operation fail", async () => {
      // Arrange

      jest
        .spyOn(mockStationRepository, "update")
        .mockImplementationOnce(() => Promise.resolve(null));
      //Act

      //Assert
      await expect(
        stationService.update(
          FixtureStationEntity._id.toString(),
          updateStationMock
        )
      ).rejects.toThrow(
        `Fail to update Station with id ${FixtureStationEntity._id}`
      );
    });
  });

  describe("getByName", () => {
    it("should get station by name with successful", async () => {
      // Arrange

      //Act
      const response = await stationService.getByName(
        FixtureStationEntity.name
      );

      //Assert
      expect(response).toEqual(FixtureStationEntity);
    });
  });
  describe("getByPlanetName", () => {
    it("should get station by planet name with successful", async () => {
      // Arrange

      //Act
      const response = await stationService.getByPlanetName(
        FixtureStationEntity.planetName
      );

      //Assert
      expect(response).toEqual(FixtureStationEntity);
    });
  });
});
