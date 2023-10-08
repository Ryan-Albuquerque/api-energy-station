import { ReservationEntity } from "../../reservation/reservation.entity";
import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { RechargeEntity } from "../entities/recharge.entity";

export abstract class IRechargeRepository {
  abstract list(active?: boolean): Promise<RechargeEntity[]>;
  abstract listByStationName(stationName: string): Promise<RechargeEntity[]>;
  abstract getById(id: string): Promise<RechargeEntity | null>;
  abstract create(recharge: CreateRechargeDTO): Promise<RechargeEntity>;
  abstract update(
    id: string,
    recharge: CreateRechargeDTO
  ): Promise<RechargeEntity | null>;
  // abstract listReservationByStationName(
  //   stationName: string
  // ): Promise<ReservationEntity[]>;
}
