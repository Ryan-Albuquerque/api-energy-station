import { RechargeEntity } from "../../recharges/entities/recharge.entity";
import { IRechargeService } from "../../recharges/services/recharge.service.interface";
import { ReservationEntity } from "../reservation.entity";
import { IReservationRepository } from "../repository/reservation.repository.interface";
import { IReservationService } from "./reservation.service.interface";
import { ObjectId } from "../../../utils/objectId";

export class ReservationService implements IReservationService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly rechargeService: IRechargeService
  ) {}

  async createReservation(
    reservation: ReservationEntity
  ): Promise<RechargeEntity> {
    const now = new Date();
    if (
      reservation.startDate >= reservation.endDate ||
      (now >= reservation.startDate && now >= reservation.endDate)
    ) {
      throw new Error(
        "End date should be greater than start Date and/or dates should be greater than now"
      );
    }

    const isValidReservationRange = await this.isValidReservationRangeByStation(
      reservation.startDate,
      reservation.endDate,
      reservation.stationName
    );

    if (!isValidReservationRange) {
      throw new Error(
        "This range is not valid for this station: " + reservation.stationName
      );
    }

    const reservationCreated = await this.reservationRepository.create(
      reservation
    );

    if (!reservationCreated) {
      throw new Error("Fail to create reservation");
    }
    return reservationCreated;
  }

  // async createRechargeByReservation(id: string): Promise<RechargeEntity> {
  //   const reservation = await this.reservationRepository.getById(id);

  //   if (!reservation) {
  //     throw new Error("Reservation not found");
  //   }

  //   return await this.rechargeService.create({
  //     stationName: reservation.stationName,
  //     userEmail: reservation.userEmail,
  //     startDate: new Date(),
  //     endDate: reservation.endDate,
  //   });
  // }

  async getById(id: string): Promise<ReservationEntity> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Is not valid Id");
    }

    const reservation = await this.reservationRepository.getById(id);

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    return reservation;
  }

  async list(fromNow?: boolean): Promise<ReservationEntity[]> {
    const reservations = await this.reservationRepository.list(fromNow);

    if (!reservations) {
      throw new Error("Reservations Not found");
    }

    return reservations;
  }

  async listByStationName(stationName: string): Promise<ReservationEntity[]> {
    const reservations = await this.reservationRepository.getAllByStationName(
      stationName
    );

    if (!reservations) {
      throw new Error("Not found reservation with this station name");
    }

    return reservations;
  }

  async update(
    id: string,
    reservation: Partial<ReservationEntity>
  ): Promise<ReservationEntity> {
    if (reservation.endDate && reservation.startDate) {
      const reservationGot = await this.getById(id);

      const isValidReservationRange =
        await this.isValidReservationRangeByStation(
          reservation?.startDate,
          reservation.endDate,
          reservationGot.stationName
        );

      if (!isValidReservationRange) {
        throw new Error(
          "This range is not valid for this station: " + reservation.stationName
        );
      }
    } else if (!reservation.endDate && !reservation.startDate) {
      throw new Error(
        "You have to update the range not only one date property"
      );
    }

    const reservationUpdated = await this.reservationRepository.update(
      id,
      reservation
    );

    if (!reservationUpdated) {
      throw new Error("Fail to update reservation");
    }

    return reservationUpdated;
  }

  private async isValidReservationRangeByStation(
    startDate: Date,
    endDate: Date,
    stationName: string
  ): Promise<boolean> {
    const savedReservations = await this.listByStationName(stationName);
    const savedRecharges = await this.rechargeService.listHistoryFromAStation(
      stationName
    );
    const isValidRangeByReservation = savedReservations.every(
      (res) =>
        startDate >= res.startDate &&
        startDate >= res.endDate &&
        endDate > startDate
    );

    const isValidRangeByRecharge = savedRecharges?.recharges.every(
      (res) =>
        startDate >= res.startDate &&
        startDate >= res.endDate &&
        endDate > startDate
    );

    if (!isValidRangeByRecharge || !isValidRangeByReservation) return false;

    return true;
  }
}
