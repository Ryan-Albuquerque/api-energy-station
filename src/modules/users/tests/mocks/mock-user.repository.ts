import { CreateOrUpdateUserDto } from "../../dtos/create-or-update-user.dto";
import { IUserRepository } from "../../repository/user.repository.interface";
import { UserEntity } from "../../user.entity";
import { FixtureUserEntity } from "./data/fixture-user-entity";

export const mockUserRepository: IUserRepository = {
  async getByEmail(_email: string): Promise<UserEntity> {
    return Promise.resolve(FixtureUserEntity);
  },
  async create(_data: CreateOrUpdateUserDto): Promise<UserEntity> {
    return Promise.resolve(FixtureUserEntity);
  },
  async update(_id: string, _data: CreateOrUpdateUserDto): Promise<UserEntity> {
    return Promise.resolve(FixtureUserEntity);
  },
};
