import { UserService } from "../services/user.service";
import { mockUserRepository } from "./mocks/mock-user.repository";
import { FixtureUserEntity } from "./mocks/data/fixture-user-entity";
import { CreateOrUpdateUserDto } from "../dtos/create-or-update-user.dto";

const userService = new UserService(mockUserRepository);

const createOrUpdateUserMock: CreateOrUpdateUserDto = {
  email: FixtureUserEntity.email,
  name: FixtureUserEntity.name,
  password: FixtureUserEntity.password,
};

beforeEach(() => jest.resetAllMocks());

describe("UserService", () => {
  describe("Create", () => {
    it("should create with successful", async () => {
      // Arrange

      //Act
      const response = await userService.create(createOrUpdateUserMock);

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
      await expect(userService.create(createOrUpdateUserMock)).rejects.toThrow(
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
        createOrUpdateUserMock
      );

      //Assert
      expect(response).toEqual(FixtureUserEntity);
    });

    it("should throw `invalid id` exception when id is invalid", async () => {
      // Arrange

      //Act

      //Assert
      await expect(
        userService.update("objectId", createOrUpdateUserMock)
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
        userService.update(
          FixtureUserEntity._id.toString(),
          createOrUpdateUserMock
        )
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
