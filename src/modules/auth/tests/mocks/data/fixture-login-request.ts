import { faker } from "@faker-js/faker";

export const FixtureLoginRequest = {
  email: faker.internet.email(),
  password: faker.string.alphanumeric({ length: { min: 6, max: 12 } }),
};
