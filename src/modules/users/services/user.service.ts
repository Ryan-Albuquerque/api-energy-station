import { IUserService } from "./user.service.interface";
import { IUserRepository } from "../repository/user.repository.interface";
import { CreateUserDto } from "../dtos/create-user.dto";
import { BcryptUtils } from "../../../utils/bcrypt";
import { ObjectId } from "../../../utils/objectId";
import { UpdateUserDto } from "../dtos/update-user.dto";
import {
  FAIL_CREATE_USER,
  ID_IS_NOT_VALID,
} from "../../../utils/errorMessages";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async create(user: CreateUserDto) {
    user.password = await BcryptUtils.hash(user.password);

    const createdUser = await this.userRepository.create(user);

    if (!createdUser) {
      throw new Error(FAIL_CREATE_USER);
    }

    return createdUser;
  }

  async update(id: string, user: UpdateUserDto) {
    if (!ObjectId.isValid(id)) {
      throw new Error(ID_IS_NOT_VALID);
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
