import { CreateOrUpdateUserDto } from "../dtos/create-or-update-user.dto";
import { UserEntity } from "../user.entity";

export abstract class IUserRepository {
  abstract getByEmail(email: string): Promise<UserEntity | null>;
  abstract create(user: CreateOrUpdateUserDto): Promise<UserEntity | null>;
  abstract update(
    id: string,
    user: CreateOrUpdateUserDto
  ): Promise<UserEntity | null>;
}
