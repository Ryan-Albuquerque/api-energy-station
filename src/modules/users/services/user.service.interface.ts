import { UserEntity } from "../user.entity";
import { CreateOrUpdateUserDto } from "../dtos/create-or-update-user.dto";

export abstract class IUserService {
  abstract create(data: CreateOrUpdateUserDto): Promise<UserEntity>;
  abstract update(id: string, data: CreateOrUpdateUserDto): Promise<UserEntity>;
  abstract getByEmail(email: string): Promise<UserEntity>;
}
