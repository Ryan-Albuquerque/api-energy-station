import { UserRepository } from "../repository/user.repository";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { FixtureUserEntity } from "./mocks/data/fixture-user-entity";
import { UserModel } from "../model/user.model";
import { mockModel } from "../../../tests/utils/mock-model";

const userRepository = new UserRepository(
  mockModel as unknown as typeof UserModel
);

const createUserMock = new CreateUserDto(FixtureUserEntity);

beforeEach(() => jest.resetAllMocks());

describe("UserRepository", () => {
  describe("create", () => {
    it("should create with successful", async () => {
      // Arrange
      jest
        .spyOn(mockModel, "create")
        .mockImplementationOnce(() => Promise.resolve(FixtureUserEntity));
      //Act
      const response = await userRepository.create(createUserMock);

      //Assert
      expect(response).toEqual(FixtureUserEntity);
    });
  });
  describe("update", () => {
    it("should update with successful", async () => {
      // Arrange
      const valueToUpdate = { name: "test" };
      const resultUpdated = { ...FixtureUserEntity, ...valueToUpdate };
      const dataToUpdate = new UpdateUserDto({ ...valueToUpdate });
      jest
        .spyOn(mockModel, "findByIdAndUpdate")
        .mockImplementationOnce(() => Promise.resolve(resultUpdated));
      //Act
      const response = await userRepository.update(
        FixtureUserEntity._id.toString(),
        dataToUpdate
      );

      //Assert
      expect(response).toEqual(resultUpdated);
      expect(response?.name).toEqual(valueToUpdate.name);
    });
  });
  describe("getByEmail", () => {
    it("should getByEmail with successful", async () => {
      // Arrange
      jest
        .spyOn(mockModel, "findOne")
        .mockImplementationOnce(() => Promise.resolve(FixtureUserEntity));
      //Act
      const response = await userRepository.getByEmail(FixtureUserEntity.email);

      //Assert
      expect(response).toEqual(FixtureUserEntity);
      expect(response?.email).toEqual(FixtureUserEntity.email);
    });
  });
});
