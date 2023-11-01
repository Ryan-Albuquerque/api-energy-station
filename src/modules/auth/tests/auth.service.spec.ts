import { BcryptUtils } from "../../../utils/bcrypt";
import { JwtUtils } from "../../../utils/jwt";
import { mockUserService } from "../../users/tests/mocks/mock-user.service";
import { AuthService } from "../services/auth.service";
import {
  FixtureLoginRequest,
  FixtureLoginResponse,
} from "./mocks/data/fixture.main";

const authService = new AuthService(mockUserService);

beforeEach(() => jest.resetAllMocks());

describe("AuthService", () => {
  describe("Login", () => {
    it("should login with successful", async () => {
      // Arrange
      jest
        .spyOn(BcryptUtils, "compare")
        .mockImplementationOnce(() => Promise.resolve(true));

      jest
        .spyOn(JwtUtils, "sign")
        .mockImplementationOnce(() => FixtureLoginResponse.token);

      //Act
      const response = await authService.login(FixtureLoginRequest);

      //Assert
      expect(response).toEqual(FixtureLoginResponse);
    });

    it("should throw `Invalid Credentials` exception when password is not valid", async () => {
      // Arrange
      jest
        .spyOn(BcryptUtils, "compare")
        .mockImplementationOnce(() => Promise.resolve(false));

      //Act

      //Assert
      await expect(authService.login(FixtureLoginRequest)).rejects.toThrow(
        "Invalid Credentials"
      );
    });
  });
});
