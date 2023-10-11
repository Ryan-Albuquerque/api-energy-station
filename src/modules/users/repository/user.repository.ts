import { IUserRepository } from "./user.repository.interface";
import { UserModel } from "../model/user.model";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserEntity } from "../user.entity";
import { UpdateUserDto } from "../dtos/update-user.dto";

export class UserRepository implements IUserRepository {
  constructor(private readonly userModel: typeof UserModel) {}

  async getByEmail(email: string): Promise<UserEntity | null> {
    return await this.userModel.findOne({ email });
  }

  async create(user: CreateUserDto): Promise<UserEntity | null> {
    return await this.userModel.create(user);
  }

  async update(id: string, user: UpdateUserDto): Promise<UserEntity | null> {
    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
  }
}
