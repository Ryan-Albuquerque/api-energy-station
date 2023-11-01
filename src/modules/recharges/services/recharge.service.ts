import { IRechargeRepository } from "../repository/recharge.repository.interface";
import { IRechargeService } from "./recharge.service.interface";
import { IUserService } from "../../users/services/user.service.interface";
import { IStationService } from "../../stations/services/station.service.interface";
import { ReservationEntity } from "../../reservation/reservation.entity";
import { HistoryRechargeInStation } from "../entities/history-recharge-in-station.entity";
import { CreateRechargeRequestDTO } from "../dtos/create-recharge-request.dto";
import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import {
  ENDDATE_SHOULD_BE_GREATER_THAN_NOW,
  INVALID_STATION_TRY_LISTSTATION,
  NON_TRIGGER_RESERVATION_TRY_LATER,
  NOT_FOUND_BY_ID,
  RECHARGE_NOT_FOUND_BY_STATION,
  STATION_IN_USE_OR_ALREADY_RECHARGING,
} from "../../../utils/errorMessages";

export class RechargeService implements IRechargeService {
  constructor(
    private readonly rechargeRepository: IRechargeRepository,
    private readonly userService: IUserService,
    private readonly stationService: IStationService
  ) {}
  async create({
    endDate,
    startDate,
    stationName,
    userEmail,
  }: CreateRechargeRequestDTO) {
    await this.validateParamsInBusinessRule(
      userEmail,
      stationName,
      startDate,
      endDate
    );

    const isStationInUseOrUserRecharging =
      await this.isStationInUseOrUserRecharging(stationName, userEmail);

    if (isStationInUseOrUserRecharging) {
      throw new Error(STATION_IN_USE_OR_ALREADY_RECHARGING);
    }

    const reservations =
      await this.rechargeRepository.listReservationByStationName(stationName);

    const isStationAlreadyReservedNow = this.isStationAlreadyReservedInTheRange(
      reservations,
      startDate,
      endDate
    );

    if (isStationAlreadyReservedNow) {
      throw new Error(NON_TRIGGER_RESERVATION_TRY_LATER);
    }

    const totalTime = this.calculateTotalHour(endDate, startDate);

    const rechargeEntity = new CreateRechargeDTO({
      endDate,
      startDate,
      stationName,
      userEmail,
      totalTime: Number.parseFloat(totalTime),
    });

    const created = await this.rechargeRepository.create(rechargeEntity);

    return created;
  }

  async list(fromNow?: boolean) {
    return await this.rechargeRepository.list(fromNow);
  }

  async listHistoryFromAStation(stationName: string) {
    const recharges = await this.rechargeRepository.listByStationName(
      stationName
    );

    if (!recharges) {
      throw new Error(RECHARGE_NOT_FOUND_BY_STATION + stationName);
    }

    const getAllRechargeTimeInStation = recharges.reduce(
      (prev, curr) => prev + (curr?.totalTime ?? 0),
      0
    );
    const allRechargeTimeInStation = getAllRechargeTimeInStation.toFixed(3);

    return {
      recharges,
      totalTime: Number.parseFloat(allRechargeTimeInStation),
    } as HistoryRechargeInStation;
  }

  async getById(id: string) {
    const recharge = await this.rechargeRepository.getById(id);

    if (!recharge) {
      throw new Error(NOT_FOUND_BY_ID + id);
    }

    return recharge;
  }

  private async validateParamsInBusinessRule(
    userEmail: string,
    stationName: string,
    startDate: Date,
    endDate: Date
  ) {
    const isEndDateValid = endDate > startDate;
    if (!isEndDateValid) {
      throw new Error(ENDDATE_SHOULD_BE_GREATER_THAN_NOW);
    }

    await this.userService.getByEmail(userEmail);

    const station = await this.stationService.getByName(stationName);
    if (!station) {
      throw new Error(INVALID_STATION_TRY_LISTSTATION);
    }
  }

  private async isStationInUseOrUserRecharging(
    stationName: string,
    userEmail: string
  ) {
    const recharges = await this.rechargeRepository.list(true);

    return recharges?.some(
      (rec) => rec.userEmail == userEmail || rec.stationName == stationName
    );
  }

  private isStationAlreadyReservedInTheRange(
    reservations: ReservationEntity[],
    startDate: Date,
    endDate: Date
  ) {
    return reservations.some(
      (res) =>
        res.startDate >= startDate && res.startDate < endDate && !res.isTrigged
    );
  }

  private calculateTotalHour(endDate: Date, startDate: Date) {
    const timeInMs = endDate.getTime() - startDate.getTime();

    return (timeInMs / 1000 / 60 / 60).toFixed(3); //to Hour
  }
}
