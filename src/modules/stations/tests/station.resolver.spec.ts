import { CreateStationDTO } from "../dtos/create-station.dto";
import { UpdateStationDTO } from "../dtos/update-station.dto";
import { StationResolver } from "../resolvers/station.resolver";
import { FixtureStationEntity } from "./mocks/data/fixture.main";
import { mockStationService } from "./mocks/mock-station.service";

const stationResolver = new StationResolver(mockStationService);

const createStationMock = new CreateStationDTO(FixtureStationEntity);

describe("StationResolver", () => {
  describe("Mutations", () => {
    describe("createStation", () => {
      it("should resolve with successful", async () => {
        const response = await stationResolver.Mutation.installStation(null, {
          station: createStationMock,
        });

        expect(response).toEqual(FixtureStationEntity);
      });
    });
    describe("updateStation", () => {
      it("should resolve with successful", async () => {
        //Arrange
        const newStation = {
          _id: FixtureStationEntity._id,
          planetName: FixtureStationEntity.planetName,
          name: "test",
        };
        jest
          .spyOn(mockStationService, "update")
          .mockImplementationOnce(() => Promise.resolve(newStation));

        //Act
        const response = await stationResolver.Mutation.updateStation(null, {
          id: FixtureStationEntity._id.toString(),
          station: { name: "test" },
        });

        //Assert
        expect(response).toEqual(newStation);
      });
    });
  });
  describe("Queries", () => {
    describe("listStations", () => {
      it("should resolve with successful", async () => {
        const response = await stationResolver.Query.listStations();

        expect(response).toEqual(new Array(10).fill(FixtureStationEntity));
      });
    });
  });
});
