import { faker } from "@faker-js/faker";
import { UserEntity } from "../../../user.entity";
import { ValidObjectId } from "../../../../../tests/utils/valid-resources";

export const FixtureUserEntity: UserEntity = {
  email: faker.internet.email(),
  _id: ValidObjectId[0],
  name: faker.person.fullName(),
  password: faker.string.alphanumeric({ length: { min: 6, max: 12 } }),
};
