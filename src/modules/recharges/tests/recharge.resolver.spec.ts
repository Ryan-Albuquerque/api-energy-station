import { CreateRechargeRequestDTO } from "../dtos/create-recharge-request.dto";
import { RechargeResolver } from "../resolvers/recharge.resolver";
import { FixtureRechargeEntity } from "./mocks/data/fixture.main";
import { mockRechargeService } from "./mocks/mock-recharge.service";

const rechargeResolver = new RechargeResolver(mockRechargeService);

const createRechargeMock = new CreateRechargeRequestDTO(FixtureRechargeEntity);

describe("RechargeResolver", () => {
  describe("Mutations", () => {
    describe("createRecharge", () => {
      it("should resolve with successful", async () => {
        const date = new Date();
        jest.useFakeTimers().setSystemTime(date);

        const response = await rechargeResolver.Mutation.recharge(null, {
          recharge: createRechargeMock,
        });

        expect(response).toEqual(FixtureRechargeEntity);
      });
    });
  });
  describe("Queries", () => {
    describe("listRecharges", () => {
      it("should resolve with successful", async () => {
        const date = new Date();
        jest.useFakeTimers().setSystemTime(date);

        const response = await rechargeResolver.Query.listRecharges();

        expect(response).toBeDefined();
      });
    });
    describe("listActiveRecharges", () => {
      it("should resolve with successful", async () => {
        const date = new Date();
        jest.useFakeTimers().setSystemTime(date);

        const response = await rechargeResolver.Query.listActiveRecharges();

        expect(response).toEqual(new Array(10).fill(FixtureRechargeEntity));
      });
    });
    describe("rechargeStationHistory", () => {
      it("should resolve with successful", async () => {
        const station = "test";
        const response = await rechargeResolver.Query.rechargeStationHistory(
          null,
          {
            stationName: station,
          }
        );

        expect(response).toEqual({
          recharges: new Array(10).fill(FixtureRechargeEntity),
          totalTime: 1,
        });
      });
    });
  });
});
