import { UpdateStationDTO } from "../../dtos/update-station.dto";
import { FixtureCreateOrUpdateStationDto } from "../mocks/data/fixture.main";

describe("UpdateStationDto", () => {
  it("should valid with success", () => {
    const data = { ...FixtureCreateOrUpdateStationDto };

    const dto = new UpdateStationDTO(data);

    expect(dto).toEqual(data);
  });

  it("should throw exception when schema is not valid", async () => {
    const data = {
      ...FixtureCreateOrUpdateStationDto,
      planetName: 1234 as any,
    };

    expect(() => new UpdateStationDTO(data)).toThrow();
  });
});
