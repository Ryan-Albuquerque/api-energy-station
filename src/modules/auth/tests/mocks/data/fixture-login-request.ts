import { faker } from "@faker-js/faker";
import { LoginRequestDTO } from "../../../dtos/login-request.dto";

export const FixtureLoginRequest: LoginRequestDTO = {
  email: faker.internet.email(),
  password: faker.string.alphanumeric({ length: { min: 6, max: 12 } }),
};
