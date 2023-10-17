import { faker } from "@faker-js/faker";

export const FixtureCreateOrUpdateUserDto = {
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.string.alphanumeric({ length: { min: 6, max: 12 } }),
};
