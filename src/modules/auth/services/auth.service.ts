import { BcryptUtils } from "../../../utils/bcrypt";
import { JwtUtils } from "../../../utils/jwt";
import { IUserService } from "../../users/services/user.service.interface";
import { LoginRequestDTO } from "../dtos/login-request.dto";
import { LoginResponseDTO } from "../dtos/login-response.dto";
import { IAuthService } from "./auth.service.interface";

export class AuthService implements IAuthService {
  constructor(private readonly userService: IUserService) {}
  async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userService.getByEmail(data.email);

    const isValidPassword = await BcryptUtils.comparePassword(
      data.password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    }

    const token = JwtUtils.sign({ id: user._id }, true);

    return new LoginResponseDTO({ token });
  }
}
