import { ResultUserDTO } from "../../dtos/result-user.dto";
import { FixtureUserEntity } from "../mocks/data/fixture.main";

describe("ResultUserDto", () => {
  it("should valid with success", () => {
    const data = { ...FixtureUserEntity };

    const dto = new ResultUserDTO(data);

    expect(dto).toEqual({ ...data, password: undefined });
  });
});
