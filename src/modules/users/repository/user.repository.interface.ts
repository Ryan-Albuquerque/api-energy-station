import { CreateOrUpdateUserDto } from "../dtos/create-or-update-user.dto";
import { User } from "../user.entity";

export abstract class IUserRepository {
  abstract getByEmail(email: string): Promise<User | null>;
  abstract create(user: CreateOrUpdateUserDto): Promise<User | null>;
  abstract update(
    id: string,
    user: CreateOrUpdateUserDto
  ): Promise<User | null>;
}
