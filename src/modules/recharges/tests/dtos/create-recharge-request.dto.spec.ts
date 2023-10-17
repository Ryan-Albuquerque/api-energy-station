import { CreateRechargeRequestDTO } from "../../dtos/create-recharge-request.dto";
import { FixtureCreateRechargeRequestDto } from "../mocks/data/fixture.main";

describe("CreateRechargeRequestDto", () => {
  it("should valid with success", () => {
    //Arrange
    const data = { ...FixtureCreateRechargeRequestDto };
    const date = new Date();
    jest.useFakeTimers().setSystemTime(date);

    const dto = new CreateRechargeRequestDTO(data);

    expect(dto).toEqual({ ...data, startDate: date });
  });

  it("should throw exception when schema is not valid", async () => {
    const data = {
      ...FixtureCreateRechargeRequestDto,
      userEmail: "123",
    };

    expect(() => new CreateRechargeRequestDTO(data)).toThrow();
  });
});
