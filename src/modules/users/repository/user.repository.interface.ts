import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserEntity } from "../user.entity";

export abstract class IUserRepository {
  abstract getByEmail(email: string): Promise<UserEntity | null>;
  abstract create(user: CreateUserDto): Promise<UserEntity | null>;
  abstract update(id: string, user: UpdateUserDto): Promise<UserEntity | null>;
}
