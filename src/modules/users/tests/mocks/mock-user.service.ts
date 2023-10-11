import { CreateUserDto } from "../../dtos/create-user.dto";
import { IUserService } from "../../services/user.service.interface";
import { UserEntity } from "../../user.entity";
import { FixtureUserEntity } from "./data/fixture.main";

export const mockUserService: IUserService = {
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
