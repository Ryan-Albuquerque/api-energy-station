import { UserModel } from "./model/user.model";
import { UserRepository } from "./repository/user.repository";
import { UserResolver } from "./resolvers/user.resolver";
import { UserService } from "./services/user.service";

const main = () => {
  const repository = new UserRepository(UserModel);
  const userService = new UserService(repository);
  const { Query, Mutation } = new UserResolver(userService);

  return { Query, Mutation, userService };
};

export const userModule = main();
