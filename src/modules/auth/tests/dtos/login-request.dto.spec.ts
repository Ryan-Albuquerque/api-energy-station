import { LoginRequestDTO } from "../../dtos/login-request.dto";
import { FixtureLoginRequest } from "../mocks/data/fixture.main";

describe("LoginRequestDto", () => {
  it("should valid with success", () => {
    const data = { ...FixtureLoginRequest };

    const dto = new LoginRequestDTO(data);

    expect(dto).toEqual(data);
  });

  it("should throw exception when schema is not valid", async () => {
    const data = { ...FixtureLoginRequest, email: "test" };

    expect(() => new LoginRequestDTO(data)).toThrow();
  });
});
