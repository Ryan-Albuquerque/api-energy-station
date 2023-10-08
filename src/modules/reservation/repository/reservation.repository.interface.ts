import { ReservationEntity } from "../reservation.entity";

export abstract class IReservationRepository {
  abstract getAllByStationName(
    stationName: string
  ): Promise<ReservationEntity[] | null>;
  abstract list(): Promise<ReservationEntity[]>;
  abstract create(reservation: ReservationEntity): Promise<ReservationEntity>;
  abstract getById(id: string): Promise<ReservationEntity | null>;
  abstract update(
    id: string,
    reservation: Partial<ReservationEntity>
  ): Promise<ReservationEntity | null>;
}
