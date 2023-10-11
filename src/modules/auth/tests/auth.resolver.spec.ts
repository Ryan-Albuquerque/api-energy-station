import { AuthResolver } from "../resolvers/auth.resolver";
import { FixtureLoginResponse } from "./mocks/data/fixture-login-reponse";
import { FixtureLoginRequest } from "./mocks/data/fixture-login-request";
import { mockAuthService } from "./mocks/mock-auth.service";

const authResolver = new AuthResolver(mockAuthService);

describe("AuthResolver", () => {
  describe("Mutations", () => {
    describe("Login", () => {
      it("should resolve graph with successful", async () => {
        const response = await authResolver.Mutation.login(null, {
          data: FixtureLoginRequest,
        });

        expect(response).toEqual(FixtureLoginResponse);
      });
    });
  });
});
