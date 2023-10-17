import { LoginRequestDTO } from "../dtos/login-request.dto";
import { LoginResponseDTO } from "../dtos/login-response.dto";

export abstract class IAuthService {
  abstract login(data: LoginRequestDTO): Promise<LoginResponseDTO>;
}
