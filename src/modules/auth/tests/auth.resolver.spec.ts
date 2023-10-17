import { AuthResolver } from "../resolvers/auth.resolver";
import {
  FixtureLoginRequest,
  FixtureLoginResponse,
} from "./mocks/data/fixture.main";
import { mockAuthService } from "./mocks/mock-auth.service";

const authResolver = new AuthResolver(mockAuthService);

describe("AuthResolver", () => {
  describe("Mutations", () => {
    describe("Login", () => {
      it("should resolve with successful", async () => {
        const response = await authResolver.Mutation.login(null, {
          data: FixtureLoginRequest,
        });

        expect(response).toEqual(FixtureLoginResponse);
      });
    });
  });
});
