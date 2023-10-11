import { LoginRequestDTO } from "../../dtos/login-request.dto";
import { LoginResponseDTO } from "../../dtos/login-response.dto";
import { IAuthService } from "../../services/auth.service.interface";
import { FixtureLoginResponse } from "./data/fixture-login-reponse";

export const mockAuthService: IAuthService = {
  async login(_data: LoginRequestDTO): Promise<LoginResponseDTO> {
    return Promise.resolve(FixtureLoginResponse);
  },
};
