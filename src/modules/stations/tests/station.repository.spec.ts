import { StationModel } from "../model/station.model";
import { mockModel } from "../../../tests/utils/mock-model";
import { PlanetModel } from "../../planets/model/planet.model";
import { StationRepository } from "../repository/station.repository";
import { UpdateStationDTO } from "../dtos/update-station.dto";
import { CreateStationDTO } from "../dtos/create-station.dto";
import { FixtureStationEntity } from "./mocks/data/fixture.main";

const statioModelMock = mockModel;
const planetModelMock = mockModel;

const stationRepository = new StationRepository(
  statioModelMock as unknown as typeof StationModel,
  planetModelMock as unknown as typeof PlanetModel
);

const createStationMock = new CreateStationDTO(FixtureStationEntity);

beforeEach(() => jest.resetAllMocks());

describe("StationRepository", () => {
  describe("create", () => {
    it("should create with successful", async () => {
      // Arrange
      jest
        .spyOn(statioModelMock, "create")
        .mockImplementationOnce(() => Promise.resolve(FixtureStationEntity));
      //Act
      const response = await stationRepository.create(createStationMock);

      //Assert
      expect(response).toEqual(FixtureStationEntity);
    });
  });
  describe("update", () => {
    it("should update with successful", async () => {
      // Arrange
      const valueToUpdate = { name: "test" };
      const resultUpdated = { ...FixtureStationEntity, ...valueToUpdate };
      const dataToUpdate = new UpdateStationDTO({ ...valueToUpdate });
      jest
        .spyOn(statioModelMock, "findByIdAndUpdate")
        .mockImplementationOnce(() => Promise.resolve(resultUpdated));
      //Act
      const response = await stationRepository.update(
        FixtureStationEntity._id.toString(),
        dataToUpdate
      );

      //Assert
      expect(response).toEqual(resultUpdated);
      expect(response?.name).toEqual(valueToUpdate.name);
    });
  });
  describe("getByPlanetName", () => {
    it("should getByEmail with successful", async () => {
      // Arrange
      jest
        .spyOn(statioModelMock, "findOne")
        .mockImplementationOnce(() => Promise.resolve(FixtureStationEntity));
      //Act
      const response = await stationRepository.getByPlanetName(
        FixtureStationEntity.planetName
      );

      //Assert
      expect(response).toEqual(FixtureStationEntity);
      expect(response?.planetName).toEqual(FixtureStationEntity.planetName);
    });
  });
  describe("getByName", () => {
    it("should getByName with successful", async () => {
      // Arrange
      jest
        .spyOn(statioModelMock, "findOne")
        .mockImplementationOnce(() => Promise.resolve(FixtureStationEntity));
      //Act
      const response = await stationRepository.getByName(
        FixtureStationEntity.name
      );

      //Assert
      expect(response).toEqual(FixtureStationEntity);
      expect(response?.name).toEqual(FixtureStationEntity.name);
    });
  });
  describe("list", () => {
    it("should list with successful", async () => {
      // Arrange
      const stationList = new Array(10).fill(FixtureStationEntity);
      jest
        .spyOn(statioModelMock, "find")
        .mockImplementationOnce(() => Promise.resolve(stationList));
      //Act
      const response = await stationRepository.list();

      //Assert
      expect(response).toEqual(stationList);
    });
  });

  describe("syncHasStationPlanetDB", () => {
    it("should update planet with station with successful", async () => {
      // Arrange
      jest
        .spyOn(planetModelMock, "updateOne")
        .mockImplementationOnce(() => Promise.resolve(null));
      //Act
      await stationRepository.syncHasStationPlanetDB(FixtureStationEntity);

      //Assert
      expect(planetModelMock.updateOne).toBeCalledWith(
        {
          name: FixtureStationEntity.planetName,
        },
        {
          hasStation: true,
        }
      );
    });
  });
});
