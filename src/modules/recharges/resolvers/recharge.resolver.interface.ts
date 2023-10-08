import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { HistoryRechargeInStation } from "../entities/history-recharge-in-station.entity";
import { RechargeEntity } from "../entities/recharge.entity";

export abstract class IRechargeResolver {
  abstract Mutation: {
    recharge: (
      _: any,
      { recharge }: { recharge: CreateRechargeDTO }
    ) => Promise<Partial<RechargeEntity>>;
  };
  abstract Query: {
    listRecharges: () => Promise<Partial<RechargeEntity>[]>;
    rechargeStationHistory: (
      _: any,
      { stationName }: { stationName: string }
    ) => Promise<Partial<HistoryRechargeInStation>>;
  };
}
