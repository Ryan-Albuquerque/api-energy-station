import { RechargeEntity } from "../../recharges/entities/recharge.entity";
import { CreateOrUpdateReservationDto } from "../dtos/create-or-update-reservation.dto";
import { ReservationEntity } from "../reservation.entity";

export abstract class IReservationService {
  abstract createReservation(
    reservation: CreateOrUpdateReservationDto
  ): Promise<ReservationEntity>;
  abstract createRechargeByReservation(id: string): Promise<RechargeEntity>;
  abstract list(): Promise<ReservationEntity[]>;
  abstract listByStationName(stationName: string): Promise<ReservationEntity[]>;
  abstract update(
    id: string,
    reservation: CreateOrUpdateReservationDto
  ): Promise<ReservationEntity>;
}
