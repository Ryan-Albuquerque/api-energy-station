import { faker } from "@faker-js/faker";

export const FixtureCreateRechargeRequestDto = {
  stationName: faker.location.city(),
  userEmail: faker.internet.email(),
  endDate: faker.date.soon(),
};
