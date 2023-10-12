import { UpdateUserDto } from "../../dtos/update-user.dto";
import { FixtureCreateOrUpdateUserDto } from "../mocks/data/fixture.main";

describe("UpdateUserDto", () => {
  it("should valid with success", () => {
    const data = { ...FixtureCreateOrUpdateUserDto };

    const dto = new UpdateUserDto(data);

    expect(dto).toEqual(data);
  });

  it("should throw exception when schema is not valid", async () => {
    const data = { ...FixtureCreateOrUpdateUserDto, email: "test" };

    expect(() => new UpdateUserDto(data)).toThrow();
  });
});
