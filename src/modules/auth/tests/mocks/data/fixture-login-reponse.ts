import { faker } from "@faker-js/faker";
import { LoginResponseDTO } from "../../../dtos/login-response.dto";

export const FixtureLoginResponse: LoginResponseDTO = {
  token: faker.string.alphanumeric(),
};
