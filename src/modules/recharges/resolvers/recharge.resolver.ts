import { CreateRechargeRequestDTO } from "../dtos/create-recharge-request.dto";
import { IRechargeService } from "../services/recharge.service.interface";
import { IRechargeResolver } from "./recharge.resolver.interface";

export class RechargeResolver implements IRechargeResolver {
  constructor(private rechargeService: IRechargeService) {}
  Mutation = {
    recharge: async (
      _: any,
      { recharge }: { recharge: CreateRechargeRequestDTO }
    ) => {
      const request = new CreateRechargeRequestDTO(recharge);

      return await this.rechargeService.create(request);
    },
  };

  Query = {
    listRecharges: async () => {
      return await this.rechargeService.list();
    },
    listActiveRecharges: async () => {
      return await this.rechargeService.list(true);
    },
    rechargeStationHistory: async (
      _: any,
      { stationName }: { stationName: string }
    ) => {
      return await this.rechargeService.listHistoryFromAStation(stationName);
    },
  };
}
