import { User } from "../user.entity";
import { CreateOrUpdateUserDto } from "../dtos/create-or-update-user.dto";

export abstract class IUserService {
  abstract create(data: CreateOrUpdateUserDto): Promise<User>;
  abstract update(id: string, data: CreateOrUpdateUserDto): Promise<User>;
  abstract getByEmail(email: string): Promise<User>;
}
