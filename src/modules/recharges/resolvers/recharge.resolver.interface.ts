import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { RechargeEntity } from "../recharge.entity";

export abstract class IRechargeResolver {
  abstract Mutation: {
    recharge: (
      _: any,
      { recharge }: { recharge: CreateRechargeDTO }
    ) => Promise<Partial<RechargeEntity>>;
  };
  abstract Query: {
    listRecharges: () => Promise<Partial<RechargeEntity>[]>;
    stationHistory: (
      _: any,
      { stationName }: { stationName: string }
    ) => Promise<Partial<RechargeEntity>[]>;
  };
}
