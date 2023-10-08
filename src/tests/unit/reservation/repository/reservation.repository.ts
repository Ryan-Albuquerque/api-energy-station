import { ReservationModel } from "../model/reservation.model";
import { ReservationEntity } from "../reservation.entity";
import { IReservationRepository } from "./reservation.repository.interface";
import { ObjectId } from "../../../utils/objectId";

export class ReservationRepository implements IReservationRepository {
  constructor(private readonly reservationModel: typeof ReservationModel) {}

  async create(reservation: ReservationEntity): Promise<ReservationEntity> {
    return await this.reservationModel.create(reservation);
  }

  async list(): Promise<ReservationEntity[]> {
    return await this.reservationModel.find();
  }

  async getById(id: string): Promise<ReservationEntity | null> {
    return await this.reservationModel.findById(id);
  }

  async getAllByStationName(
    stationName: string
  ): Promise<ReservationEntity[] | null> {
    return await this.reservationModel.find({
      stationName: stationName,
    });
  }

  async update(
    id: string,
    reservation: Partial<ReservationEntity>
  ): Promise<ReservationEntity | null> {
    return await this.reservationModel.findByIdAndUpdate(id, reservation);
  }
}
