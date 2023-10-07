import { LoginRequestDTO } from "../dtos/login-request.dto";
import { IAuthService } from "../services/auth.service.interface";
import { IAuthResolver } from "./auth.resolver.interface";

export class AuthResolver implements IAuthResolver {
  constructor(private readonly authService: IAuthService) {}
  Mutation = {
    login: async (_: any, { data }: { data: LoginRequestDTO }) => {
      return this.authService.login(data);
    },
  };
}
