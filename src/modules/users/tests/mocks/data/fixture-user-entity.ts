import { faker } from "@faker-js/faker";
import { UserEntity } from "../../../user.entity";

export const FixtureUserEntity: UserEntity = {
  email: faker.internet.email(),
  _id: faker.string.alpha(),
  name: faker.person.fullName(),
  password: faker.string.alphanumeric({ length: { min: 6, max: 12 } }),
};
