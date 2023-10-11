import { UserEntity } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export abstract class IUserService {
  abstract create(data: CreateUserDto): Promise<UserEntity>;
  abstract update(id: string, data: UpdateUserDto): Promise<UserEntity>;
  abstract getByEmail(email: string): Promise<UserEntity>;
}
