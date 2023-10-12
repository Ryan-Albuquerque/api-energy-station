import { CreateUserDto } from "../../dtos/create-user.dto";
import { FixtureCreateOrUpdateUserDto } from "../mocks/data/fixture.main";

describe("CreateUserDto", () => {
  it("should valid with success", () => {
    const data = { ...FixtureCreateOrUpdateUserDto };

    const dto = new CreateUserDto(data);

    expect(dto).toEqual(data);
  });

  it("should throw exception when schema is not valid", async () => {
    const data = { ...FixtureCreateOrUpdateUserDto, email: "test" };

    expect(() => new CreateUserDto(data)).toThrow();
  });
});
