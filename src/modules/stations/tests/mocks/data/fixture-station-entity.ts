import { faker } from "@faker-js/faker";
import { ValidObjectId } from "../../../../../tests/utils/valid-resources";
import { StationEntity } from "../../../station.entity";

export const FixtureStationEntity: StationEntity = {
  planetName: faker.location.country(),
  _id: ValidObjectId[0],
  name: faker.location.city(),
};
