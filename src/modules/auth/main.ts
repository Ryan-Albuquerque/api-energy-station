// DI

import { userModule } from "../users/main";
import { AuthenticationMiddleware } from "./middlewares/authentication.middleware";
import { AuthResolver } from "./resolvers/auth.resolver";
import { AuthService } from "./services/auth.service";

const main = () => {
  const authenticationMiddleware = new AuthenticationMiddleware();

  const authService = new AuthService(userModule.userService);

  const { Mutation } = new AuthResolver(authService);

  return { authenticationMiddleware, Mutation };
};

export const authModule = main();
