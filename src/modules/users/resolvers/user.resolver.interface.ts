import { CreateUserDto } from "../dtos/create-user.dto";
import { ResultUserDTO } from "../dtos/result-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export abstract class IUserResolver {
  abstract Mutation: {
    updateUser: (
      _: any,
      { id, user }: { id: string; user: UpdateUserDto }
    ) => Promise<ResultUserDTO>;
    createUser: (
      _: any,
      { user }: { user: CreateUserDto }
    ) => Promise<ResultUserDTO>;
  };

  abstract Query: {
    getUserByEmail: (
      _: any,
      { email }: { email: string }
    ) => Promise<ResultUserDTO>;
  };
}
