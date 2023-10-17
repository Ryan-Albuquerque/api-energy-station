import { IUserService } from "./user.service.interface";
import { IUserRepository } from "../repository/user.repository.interface";
import { CreateUserDto } from "../dtos/create-user.dto";
import { BcryptUtils } from "../../../utils/bcrypt";
import { ObjectId } from "../../../utils/objectId";
import { UpdateUserDto } from "../dtos/update-user.dto";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async create(user: CreateUserDto) {
    user.password = await BcryptUtils.hashPassword(user.password);

    const createdUser = await this.userRepository.create(user);

    if (!createdUser) {
      throw new Error("Fail to create User");
    }

    return createdUser;
  }

  async update(id: string, user: UpdateUserDto) {
    if (!ObjectId.isValid(id)) {
      throw new Error(`id ${id} is invalid`);
    }

    const updatedUser = await this.userRepository.update(id, user);

    if (!updatedUser) {
      throw new Error(`Fail to update User with id: ${id}`);
    }

    return updatedUser;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    return user;
  }
}
