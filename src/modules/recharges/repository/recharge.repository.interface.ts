import { ReservationEntity } from "../../reservation/reservation.entity";
import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { RechargeEntity } from "../recharge.entity";

export abstract class IRechargeRepository {
  abstract list(): Promise<RechargeEntity[] | null>;
  abstract listByStationName(
    stationName: string
  ): Promise<RechargeEntity[] | null>;
  abstract getById(id: string): Promise<RechargeEntity | null>;
  abstract create(recharge: CreateRechargeDTO): Promise<RechargeEntity | null>;
  abstract update(
    id: string,
    recharge: CreateRechargeDTO
  ): Promise<RechargeEntity | null>;
  abstract getActiveRecharges(): Promise<RechargeEntity[] | null>;
  abstract listReservationByStationName(
    stationName: string
  ): Promise<ReservationEntity[]>;
}
