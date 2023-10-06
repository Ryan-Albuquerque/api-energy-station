import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { RechargeEntity } from "../recharge.entity";

export abstract class IRechargeService {
  // abstract getHistoryFromStation(
  //   stationName: string
  // ): Promise<RechargeEntity[]>;
  abstract list(): Promise<RechargeEntity[]>;
  abstract create(data: CreateRechargeDTO): Promise<RechargeEntity>;
  // abstract getById(id: string): Promise<RechargeEntity>;
}
