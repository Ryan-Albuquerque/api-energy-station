import { IUserService } from "../services/user.service.interface";
import { IUserResolver } from "./user.resolver.interface";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ResultUserDTO } from "../dtos/result-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export class UserResolver implements IUserResolver {
  constructor(private readonly userService: IUserService) {}

  Mutation = {
    createUser: async (_: any, { user }: { user: CreateUserDto }) => {
      const userData = new CreateUserDto(user);

      const createdUser = await this.userService.create(userData);

      return new ResultUserDTO(createdUser);
    },
    updateUser: async (
      _: any,
      { id, user }: { id: string; user: UpdateUserDto }
    ) => {
      const request = new UpdateUserDto(user);

      const updatedUser = await this.userService.update(id, request);

      return new ResultUserDTO(updatedUser);
    },
  };

  Query = {
    getUserByEmail: async (_: any, { email }: { email: string }) => {
      const user = await this.userService.getByEmail(email);

      return new ResultUserDTO(user);
    },
  };
}
