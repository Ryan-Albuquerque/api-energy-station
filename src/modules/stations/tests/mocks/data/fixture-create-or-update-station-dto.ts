import { faker } from "@faker-js/faker";

export const FixtureCreateOrUpdateStationDto = {
  name: faker.location.city(),
  planetName: faker.location.country(),
};
