import { RechargeEntity } from "../../recharges/recharge.entity";
import { IRechargeService } from "../../recharges/services/recharge.service.interface";
import { ReservationEntity } from "../reservation.entity";
import { IReservationRepository } from "../repository/reservation.repository.interface";
import { IReservationService } from "./reservation.service.interface";

export class ReservationService implements IReservationService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly rechargeService: IRechargeService
  ) {}

  async createReservation(
    reservation: ReservationEntity
  ): Promise<RechargeEntity> {
    this.isValidDate(reservation.startDate, reservation.endDate);

    const savedReservations = await this.listByStationName(
      reservation.stationName
    );
    const savedRecharges = await this.rechargeService.getHistoryFromStation(
      reservation.stationName
    );

    const newReservationStartDate = new Date(reservation.startDate);
    const newReservationEndDate = new Date(reservation.endDate);

    const occupiedDates = [...savedReservations, ...savedRecharges];

    this.isStationBusy(
      occupiedDates,
      newReservationStartDate,
      newReservationEndDate
    );

    const reservationCreated = await this.reservationRepository.create(
      reservation
    );

    if (!reservationCreated) {
      throw new Error("Fail to create reservation");
    }
    return reservationCreated;
  }

  async createRechargeByReservation(id: string): Promise<RechargeEntity> {
    const reservation = await this.reservationRepository.getById(id);

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    const itIsUpToRecharge =
      new Date() >= reservation.startDate && new Date() <= reservation.endDate;

    if (!itIsUpToRecharge) {
      throw new Error("Incorrect time to recharge");
    }

    return await this.rechargeService.create({
      stationName: reservation.stationName,
      userEmail: reservation.userEmail,
      startDate: new Date(),
      endDate: reservation.endDate,
    });
  }

  async list(): Promise<ReservationEntity[]> {
    const reservations = await this.reservationRepository.list();

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
    reservation: ReservationEntity
  ): Promise<ReservationEntity> {
    const reservationUpdated = await this.reservationRepository.update(
      id,
      reservation
    );

    if (!reservationUpdated) {
      throw new Error("Fail to update reservation");
    }

    return reservationUpdated;
  }

  private isStationBusy(
    ocupedDates: ReservationEntity[] | RechargeEntity[],
    inputStarDate: Date,
    inputEndDate: Date
  ) {
    ocupedDates.forEach((ocupedDate) => {
      const stationIsReservated =
        inputEndDate >= ocupedDate.startDate &&
        inputStarDate <= ocupedDate.endDate;

      if (stationIsReservated) {
        throw new Error("Staion is busy");
      }
    });
  }

  private isValidDate(startDate: Date | string, endDate: Date | string) {
    const isValid =
      new Date(startDate) < new Date(endDate) ||
      new Date(startDate) < new Date();

    if (!isValid) {
      throw new Error("Invalid date");
    }
  }
}
