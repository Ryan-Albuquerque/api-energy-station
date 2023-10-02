import { IUserRepository } from "./user.repository.interface";
import { UserModel } from "../model/user.model";
import { CreateOrUpdateUserDto } from "../dtos/create-or-update-user.dto";
import { User } from "../user.entity";
import { Types } from "mongoose";

export class UserRepository implements IUserRepository {
  constructor(private readonly userModel: typeof UserModel) {}

  async getByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  async create(user: CreateOrUpdateUserDto): Promise<User | null> {
    return await this.userModel.create(user);
  }

  async update(id: string, user: CreateOrUpdateUserDto): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`id ${id} is invalid`);
    }

    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
  }
}
