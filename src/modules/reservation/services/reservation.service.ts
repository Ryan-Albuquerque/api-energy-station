import { RechargeEntity } from "../../recharges/entities/recharge.entity";
import { IRechargeService } from "../../recharges/services/recharge.service.interface";
import { ReservationEntity } from "../reservation.entity";
import { IReservationRepository } from "../repository/reservation.repository.interface";
import { IReservationService } from "./reservation.service.interface";
import { ObjectId } from "../../../utils/objectId";
import { CreateOrUpdateReservationDto } from "../dtos/create-or-update-reservation.dto";

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
      reservation
    );

    if (!isValidReservationRange) {
      throw new Error(
        "This range is not valid for this station: " +
          reservation.stationName +
          "\n or user already have reservation for this time"
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

  async triggerReservation(id: string): Promise<RechargeEntity> {
    const reservation = await this.reservationRepository.getById(id);

    if (!reservation || reservation.isTrigged) {
      throw new Error("Reservation not found or already trigged");
    }

    const now = new Date();
    if (now <= reservation.startDate || now > reservation.endDate) {
      throw new Error("Reservation is not able to start recharge");
    }
    const activeRecharges = await this.rechargeService.list(true);

    const isValidToStartRecharge = activeRecharges.every(
      (rec) =>
        rec.stationName !== reservation.stationName ||
        rec.userEmail !== reservation.userEmail
    );

    if (!isValidToStartRecharge) {
      throw new Error("User is recharging or Station is in use");
    }

    await this.update(reservation._id.toString(), {
      isTrigged: true,
    });

    console.log(
      `Starting recharge reservation(${reservation._id}) from ${reservation.stationName}`
    );

    const recharge = await this.rechargeService.create({
      endDate: reservation.endDate,
      stationName: reservation.stationName,
      userEmail: reservation.userEmail,
      startDate: reservation.startDate,
    });

    console.log(
      `Recharge(${recharge._id}) reservation(${reservation._id}) from ${reservation.stationName} started`
    );

    return recharge;
  }

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
    reservation: Partial<CreateOrUpdateReservationDto>
  ): Promise<ReservationEntity> {
    const reservationGot = await this.getById(id);

    if (!reservationGot) {
      throw new Error("Invalid reservation id");
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

  private async isValidReservationRangeByStation({
    startDate,
    endDate,
    stationName,
    userEmail,
  }: ReservationEntity): Promise<boolean> {
    const savedReservations = await this.listByStationName(stationName);
    const savedRecharges = await this.rechargeService.list(true);

    const isValidRangeByReservation = savedReservations.every(
      (res) =>
        (startDate >= res.endDate || endDate <= res.startDate) &&
        endDate > startDate
    );

    const isValidRangeByRecharge = savedRecharges.every(
      (res) =>
        endDate > startDate &&
        !(
          res.endDate > startDate &&
          res.stationName == stationName &&
          res.userEmail == userEmail
        )
    );

    if (!isValidRangeByRecharge || !isValidRangeByReservation) return false;

    return true;
  }
}
