// import { BcryptUtils } from "../../../utils/bcrypt";
// import { JwtUtils } from "../../../utils/jwt";
// import { mockUserService } from "./mocks/mock-user.service";
// import { AuthService } from "../services/auth.service";
// import { FixtureLoginResponse } from "./mocks/data/fixture-login-reponse";
// import { FixtureLoginRequest } from "./mocks/data/fixture-login-request";

// const authService = new AuthService(mockUserService);

// beforeEach(() => jest.resetAllMocks());

// describe("AuthService", () => {
//   describe("Login", () => {
//     it("should login with successful", async () => {
//       // Arrange
//       jest
//         .spyOn(BcryptUtils, "comparePassword")
//         .mockImplementationOnce(() => Promise.resolve(true));

//       jest
//         .spyOn(JwtUtils, "sign")
//         .mockImplementationOnce(() => FixtureLoginResponse.token);

//       //Act
//       const response = await authService.login(FixtureLoginRequest);

//       //Assert
//       expect(response).toEqual(FixtureLoginResponse);
//     });

//     it("should thow an `Invalid Credentials` exception", async () => {
//       // Arrange
//       jest
//         .spyOn(BcryptUtils, "comparePassword")
//         .mockImplementationOnce(() => Promise.resolve(false));

//       //Act

//       //Assert
//       await expect(authService.login(FixtureLoginRequest)).rejects.toThrow(
//         "Invalid Credentials"
//       );
//     });
//   });
// });
