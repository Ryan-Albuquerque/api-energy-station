import { CreateOrUpdateUserDto } from "../dtos/create-or-update-user.dto";
import { ResultUserDTO } from "../dtos/result-user.dto";

export abstract class IUserResolver {
  abstract Mutation: {
    updateUser: (
      _: any,
      { id, user }: { id: string; user: CreateOrUpdateUserDto }
    ) => Promise<ResultUserDTO>;
    createUser: (
      _: any,
      { user }: { user: CreateOrUpdateUserDto }
    ) => Promise<ResultUserDTO>;
  };

  abstract Query: {
    getUserByEmail: (
      _: any,
      { email }: { email: string }
    ) => Promise<ResultUserDTO>;
  };
}
