import { faker } from "@faker-js/faker";
import { ValidObjectId } from "../../../../../tests/utils/valid-resources";
import { RechargeEntity } from "../../../entities/recharge.entity";

export const FixtureRechargeEntity: RechargeEntity = {
  _id: ValidObjectId[0],
  stationName: faker.location.city(),
  userEmail: faker.internet.email(),
  endDate: faker.date.soon(),
  startDate: new Date(),
  totalTime: 1,
};
