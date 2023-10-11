import { LoginResponseDTO } from "../../dtos/login-response.dto";
import { FixtureLoginResponse } from "../mocks/data/fixture-login-reponse";

describe("LoginResponseDto", () => {
  it("should valid with success", () => {
    const data = { ...FixtureLoginResponse };

    const dto = new LoginResponseDTO(data);

    expect(dto).toEqual(data);
  });

  it("should throw exception when schema is not valid", async () => {
    //Arrange
    const data = { token: 123 as any };

    expect(() => new LoginResponseDTO(data)).toThrow();
  });
});
