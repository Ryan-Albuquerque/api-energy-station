import { IUserService } from "../services/user.service.interface";
import { IUserResolver } from "./user.resolver.interface";
import { CreateOrUpdateUserDto } from "../dtos/create-or-update-user.dto";
import { ResultUserDTO } from "../dtos/result-user.dto";

export class UserResolver implements IUserResolver {
  constructor(private readonly userService: IUserService) {}

  Mutation = {
    createUser: async (_: any, { user }: { user: CreateOrUpdateUserDto }) => {
      const userData = new CreateOrUpdateUserDto(user);

      const createdUser = await this.userService.create(userData);

      return new ResultUserDTO(createdUser);
    },
    updateUser: async (
      _: any,
      { id, user }: { id: string; user: CreateOrUpdateUserDto }
    ) => {
      const request = new CreateOrUpdateUserDto(user);

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
