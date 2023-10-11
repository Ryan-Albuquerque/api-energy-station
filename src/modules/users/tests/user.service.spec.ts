import { UserService } from "../services/user.service";
import { mockUserRepository } from "./mocks/mock-user.repository";
import { FixtureUserEntity } from "./mocks/data/fixture.main";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

const userService = new UserService(mockUserRepository);

const createUserMock = new CreateUserDto(FixtureUserEntity);
const updateUserMock = new UpdateUserDto(FixtureUserEntity);

beforeEach(() => jest.resetAllMocks());

describe("UserService", () => {
  describe("Create", () => {
    it("should create with successful", async () => {
      // Arrange

      //Act
      const response = await userService.create(createUserMock);

      //Assert
      expect(response).toEqual(FixtureUserEntity);
    });

    it("should not create user", async () => {
      // Arrange
      jest
        .spyOn(mockUserRepository, "create")
        .mockImplementationOnce(() => Promise.resolve(null));

      //Act

      //Assert
      await expect(userService.create(createUserMock)).rejects.toThrow(
        "Fail to create User"
      );
    });
  });
  describe("Update", () => {
    it("should update with successful", async () => {
      // Arrange

      //Act
      const response = await userService.update(
        FixtureUserEntity._id.toString(),
        updateUserMock
      );

      //Assert
      expect(response).toEqual(FixtureUserEntity);
    });

    it("should throw `invalid id` exception when id is invalid", async () => {
      // Arrange

      //Act

      //Assert
      await expect(
        userService.update("objectId", updateUserMock)
      ).rejects.toThrow(`id objectId is invalid`);
    });

    it("should throw `fail to update` exception when update operation fail", async () => {
      // Arrange

      jest
        .spyOn(mockUserRepository, "update")
        .mockImplementationOnce(() => Promise.resolve(null));
      //Act

      //Assert
      await expect(
        userService.update(FixtureUserEntity._id.toString(), updateUserMock)
      ).rejects.toThrow(
        `Fail to update User with id: ${FixtureUserEntity._id}`
      );
    });
  });

  describe("GetByEmail", () => {
    it("should get user by email with successful", async () => {
      // Arrange

      //Act
      const response = await userService.getByEmail(FixtureUserEntity.email);

      //Assert
      expect(response).toEqual(FixtureUserEntity);
    });

    it("should throw `user not found` exception when email not match", async () => {
      // Arrange
      jest
        .spyOn(mockUserRepository, "getByEmail")
        .mockImplementationOnce(() => Promise.resolve(null));

      //Act

      //Assert
      await expect(
        userService.getByEmail(FixtureUserEntity.email)
      ).rejects.toThrow(`User with email ${FixtureUserEntity.email} not found`);
    });
  });
});
