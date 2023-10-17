import { LoginRequestDTO } from "../dtos/login-request.dto";
import { LoginResponseDTO } from "../dtos/login-response.dto";

export abstract class IAuthResolver {
  abstract Mutation: {
    login: (
      _: any,
      { data }: { data: LoginRequestDTO }
    ) => Promise<LoginResponseDTO>;
  };
}
