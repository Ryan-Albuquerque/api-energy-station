import { CreateUserDto } from "../../dtos/create-user.dto";
import { IUserRepository } from "../../repository/user.repository.interface";
import { UserEntity } from "../../user.entity";
import { FixtureUserEntity } from "./data/fixture.main";

export const mockUserRepository: IUserRepository = {
  async getByEmail(_email: string): Promise<UserEntity> {
    return Promise.resolve(FixtureUserEntity);
  },
  async create(_data: CreateUserDto): Promise<UserEntity> {
    return Promise.resolve(FixtureUserEntity);
  },
  async update(_id: string, _data: CreateUserDto): Promise<UserEntity> {
    return Promise.resolve(FixtureUserEntity);
  },
};
