import { CreateStationDTO } from "../../dtos/create-station.dto";
import { FixtureCreateOrUpdateStationDto } from "../mocks/data/fixture.main";

describe("CreateStationDto", () => {
  it("should valid with success", () => {
    const data = { ...FixtureCreateOrUpdateStationDto };

    const dto = new CreateStationDTO(data);

    expect(dto).toEqual(data);
  });

  it("should throw exception when schema is not valid", async () => {
    const data = { ...FixtureCreateOrUpdateStationDto, planetName: 123 as any };

    expect(() => new CreateStationDTO(data)).toThrow();
  });
});
