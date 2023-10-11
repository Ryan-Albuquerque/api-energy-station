import { CreateUserDto } from "../dtos/create-user.dto";
import { ResultUserDTO } from "../dtos/result-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserResolver } from "../resolvers/user.resolver";
import { FixtureUserEntity } from "./mocks/data/fixture.main";
import { mockUserService } from "./mocks/mock-user.service";

const authResolver = new UserResolver(mockUserService);

const createUserMock = new CreateUserDto(FixtureUserEntity);
const updateUserMock = new UpdateUserDto(FixtureUserEntity);
const resultUserMock = new ResultUserDTO(FixtureUserEntity);

describe("UserResolver", () => {
  describe("Mutations", () => {
    describe("createUser", () => {
      it("should resolve with successful", async () => {
        const response = await authResolver.Mutation.createUser(null, {
          user: createUserMock,
        });

        expect(response).toEqual(resultUserMock);
      });
    });
    describe("updateUser", () => {
      it("should resolve with successful", async () => {
        const response = await authResolver.Mutation.updateUser(null, {
          id: FixtureUserEntity._id.toString(),
          user: { ...updateUserMock, name: "test" },
        });

        expect(response).toEqual({ ...updateUserMock, name: "test" });
      });
    });
  });
  describe("Queries", () => {
    describe("getUserByEmail", () => {
      it("should resolve with successful", async () => {
        const response = await authResolver.Query.getUserByEmail(null, {
          email: FixtureUserEntity._id.toString(),
        });

        expect(response).toEqual(resultUserMock);
      });
    });
  });
});
