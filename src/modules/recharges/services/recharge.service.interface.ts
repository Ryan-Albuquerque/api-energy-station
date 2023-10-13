import { CreateRechargeRequestDTO } from "../dtos/create-recharge-request.dto";
import { HistoryRechargeInStation } from "../entities/history-recharge-in-station.entity";
import { RechargeEntity } from "../entities/recharge.entity";

export abstract class IRechargeService {
  abstract listHistoryFromAStation(
    stationName: string
  ): Promise<HistoryRechargeInStation>;
  abstract list(fromNow?: boolean): Promise<RechargeEntity[]>;
  abstract create(data: CreateRechargeRequestDTO): Promise<RechargeEntity>;
  // abstract getById(id: string): Promise<RechargeEntity>;
}
