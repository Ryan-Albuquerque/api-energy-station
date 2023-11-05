import { RechargeEntity } from "../../recharges/entities/recharge.entity";
import { IRechargeService } from "../../recharges/services/recharge.service.interface";
import { ReservationEntity } from "../reservation.entity";
import { IReservationRepository } from "../repository/reservation.repository.interface";
import { IReservationService } from "./reservation.service.interface";
import { ObjectId } from "../../../utils/objectId";
import { CreateOrUpdateReservationDto } from "../dtos/create-or-update-reservation.dto";
import {
  ENDDATE_SHOULD_BE_GREATER_THAN_NOW_OR_STARTDATE,
  FAIL_TO_UPDATE_WITH_ID,
  ID_IS_NOT_VALID,
  RANGE_INVALID_FOR_STATION,
  RESERVATION_ID_INVALID,
  RESERVATION_NOT_ABLE_START,
  RESERVATION_NOT_FOUND,
  RESERVATION_NOT_FOUND_WITH_STATION,
  USER_HAVE_RESERVATION,
  USER_RECHARGING_STATION_IN_USE,
} from "../../../utils/errorMessages";

export class ReservationService implements IReservationService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly rechargeService: IRechargeService
  ) {}

  async createReservation(
    reservation: CreateOrUpdateReservationDto
  ): Promise<RechargeEntity> {
    const now = new Date();
    if (
      reservation.startDate >= reservation.endDate ||
      (now >= reservation.startDate && now >= reservation.endDate)
    ) {
      throw new Error(ENDDATE_SHOULD_BE_GREATER_THAN_NOW_OR_STARTDATE);
    }

    const isValidReservationRange = await this.isValidReservationRangeByStation(
      reservation
    );

    if (!isValidReservationRange) {
      throw new Error(
        RANGE_INVALID_FOR_STATION +
          reservation.stationName +
          "\n " +
          USER_HAVE_RESERVATION
      );
    }

    const reservationCreated = await this.reservationRepository.create(
      reservation as ReservationEntity
    );

    return reservationCreated;
  }

  async triggerReservation(id: string): Promise<RechargeEntity> {
    const reservation = await this.reservationRepository.getById(id);

    if (!reservation) {
      throw new Error(RESERVATION_NOT_FOUND);
    }

    const now = new Date();
    if (reservation.startDate > now || now > reservation.endDate) {
      throw new Error(RESERVATION_NOT_ABLE_START);
    }
    const activeRecharges = await this.rechargeService.list(true);

    const isValidToStartRecharge = activeRecharges.every(
      (rec) =>
        rec.stationName !== reservation.stationName &&
        rec.userEmail !== reservation.userEmail
    );

    if (!isValidToStartRecharge) {
      throw new Error(USER_RECHARGING_STATION_IN_USE);
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
      throw new Error(ID_IS_NOT_VALID);
    }

    const reservation = await this.reservationRepository.getById(id);

    if (!reservation) {
      throw new Error(RESERVATION_NOT_FOUND);
    }

    return reservation;
  }

  async list(fromNow?: boolean): Promise<ReservationEntity[]> {
    const reservations = await this.reservationRepository.list(fromNow);

    return reservations;
  }

  async listByStationName(stationName: string): Promise<ReservationEntity[]> {
    const reservations = await this.reservationRepository.getAllByStationName(
      stationName
    );

    if (!reservations) {
      throw new Error(RESERVATION_NOT_FOUND_WITH_STATION);
    }

    return reservations;
  }

  async update(
    id: string,
    reservation: Partial<CreateOrUpdateReservationDto>
  ): Promise<ReservationEntity> {
    const reservationGot = await this.getById(id);

    if (!reservationGot) {
      throw new Error(RESERVATION_ID_INVALID);
    }

    const reservationUpdated = await this.reservationRepository.update(
      id,
      reservation
    );

    if (!reservationUpdated) {
      throw new Error(FAIL_TO_UPDATE_WITH_ID + id);
    }

    return reservationUpdated;
  }

  private async isValidReservationRangeByStation({
    startDate,
    endDate,
    stationName,
    userEmail,
  }: CreateOrUpdateReservationDto): Promise<boolean> {
    const savedReservations = await this.listByStationName(stationName);
    const savedRecharges = await this.rechargeService.list(true);

    const isValidRangeByReservation = savedReservations.every(
      (res) => startDate >= res.endDate || endDate <= res.startDate
    );

    const isValidRangeByRecharge = savedRecharges.every(
      (res) =>
        startDate >= res.endDate ||
        (res.stationName !== stationName && res.userEmail !== userEmail)
    );

    if (!isValidRangeByRecharge || !isValidRangeByReservation) return false;

    return true;
  }
}
