import { UserModel } from "../../model/user.model";
import { FixtureUserEntity } from "./data/fixture.main";

export const mockUserModel: Partial<typeof UserModel> = {
  findOne: jest.fn().mockImplementation(() => FixtureUserEntity),
  create: jest.fn().mockImplementation(() => FixtureUserEntity),
  findByIdAndUpdate: jest.fn().mockImplementation(() => FixtureUserEntity),
};
