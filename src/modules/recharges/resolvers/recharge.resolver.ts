import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { IRechargeService } from "../services/recharge.service.interface";
import { IRechargeResolver } from "./recharge.resolver.interface";

export class RechargeResolver implements IRechargeResolver {
  constructor(private rechargeService: IRechargeService) {}
  Mutation = {
    recharge: async (_: any, { recharge }: { recharge: CreateRechargeDTO }) => {
      const request = new CreateRechargeDTO(recharge);

      return await this.rechargeService.create(request);
    },
  };

  Query = {
    listRecharges: async () => {
      return await this.rechargeService.list();
    },
    // stationHistory: async (
    //   _: any,
    //   { stationName }: { stationName: string }
    // ) => {
    //   return await this.rechargeService.getHistoryFromStation(stationName);
    // },
  };
}
