import { CreateRechargeDTO } from "../../dtos/create-recharge.dto";
import { FixtureRechargeEntity } from "../mocks/data/fixture.main";

describe("CreateRechargeDto", () => {
  it("should valid with success", () => {
    //Arrange
    const date = new Date();
    jest.useFakeTimers().setSystemTime(date);
    const data = { ...FixtureRechargeEntity, _id: undefined };

    const dto = new CreateRechargeDTO(data);

    expect(dto).toEqual(data);
  });

  it("should throw exception when schema is not valid", async () => {
    const data = {
      ...FixtureRechargeEntity,
      stationName: 123 as any,
    };

    expect(() => new CreateRechargeDTO(data)).toThrow();
  });
});
