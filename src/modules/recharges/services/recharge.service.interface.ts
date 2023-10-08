import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { HistoryRechargeInStation } from "../entities/history-recharge-in-station.entity";
import { RechargeEntity } from "../entities/recharge.entity";

export abstract class IRechargeService {
  abstract listHistoryFromAStation(
    stationName: string
  ): Promise<HistoryRechargeInStation>;
  abstract list(): Promise<RechargeEntity[]>;
  abstract create(data: CreateRechargeDTO): Promise<RechargeEntity>;
  // abstract getById(id: string): Promise<RechargeEntity>;
}
