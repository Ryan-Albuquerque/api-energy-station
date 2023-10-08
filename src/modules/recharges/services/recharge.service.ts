import { IRechargeRepository } from "../repository/recharge.repository.interface";
import { IRechargeService } from "./recharge.service.interface";
import { IUserService } from "../../users/services/user.service.interface";
import { IStationService } from "../../stations/services/station.service.interface";
import { ReservationEntity } from "../../reservation/reservation.entity";
import { HistoryRechargeInStation } from "../entities/history-recharge-in-station.entity";
import { CreateRechargeRequestDTO } from "../dtos/create-recharge-request.dto";
import { CreateRechargeDTO } from "../dtos/create-recharge.dto";

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
    await this.ValidateParamsInBusinessRule(
      userEmail,
      stationName,
      startDate,
      endDate
    );

    if (await this.isStationInUseOrUserRecharging(stationName, userEmail)) {
      throw new Error("Station in use or user already recharding");
    }

    const reservations = await this.rechargeRepository.listByStationName(
      stationName
    );

    const isStationAlreadyReservedNow = await this.isStationAlreadyReservedNow(
      reservations,
      startDate
    );

    if (!isStationAlreadyReservedNow) {
      throw new Error(
        "This is station have a recharge reservation now, try again later"
      );
    }

    const totalTime = this.calculateTotalMinutes(endDate, startDate);

    const rechargeEntity = new CreateRechargeDTO({
      endDate,
      startDate,
      stationName,
      userEmail,
      totalTime: Number.parseFloat(totalTime),
    });

    const created = await this.rechargeRepository.create(rechargeEntity);

    if (!created) {
      throw new Error("Fail to create a recharding");
    }

    return created;
  }

  async list() {
    return await this.rechargeRepository.list();
  }

  async listHistoryFromAStation(stationName: string) {
    const recharges = await this.rechargeRepository.listByStationName(
      stationName
    );

    if (!recharges) {
      throw new Error(`Not found Recharges with station name ${stationName}`);
    }

    const getAllRechargeTimeInStation = recharges.reduce(
      (prev, curr) => prev + (curr?.totalTime ?? 0),
      0
    );
    const allRechargeTimeInStation = (getAllRechargeTimeInStation / 60).toFixed(
      3
    );

    return {
      recharges,
      totalTime: Number.parseFloat(allRechargeTimeInStation),
    } as HistoryRechargeInStation;
  }

  async getById(id: string) {
    const recharge = await this.rechargeRepository.getById(id);

    if (!recharge) {
      throw new Error(`Not found with id ${id}`);
    }

    return recharge;
  }

  private async ValidateParamsInBusinessRule(
    userEmail: string,
    stationName: string,
    startDate: Date,
    endDate: Date
  ) {
    const isEndDateValid = endDate > startDate;
    if (!isEndDateValid) {
      throw new Error(
        "Informed endDate is invalid, should be greater than now"
      );
    }

    await this.userService.getByEmail(userEmail);

    const station = await this.stationService.getByName(stationName);
    if (!station) {
      throw new Error(
        "Invalid Station, try listStation to see available station"
      );
    }
  }

  private async isStationInUseOrUserRecharging(
    stationName: string,
    userEmail: string
  ) {
    const recharges = await this.rechargeRepository.list(true);

    return recharges?.some(
      (rec) => rec.userEmail == userEmail && rec.stationName == stationName
    );
  }

  private isStationAlreadyReservedNow(
    reservations: ReservationEntity[],
    startDate: Date
  ) {
    return reservations.some((res) => res.endDate > startDate);
  }

  private calculateTotalMinutes(endDate: Date, startDate: Date) {
    const timeInMs = endDate.getTime() - startDate.getTime();

    return (timeInMs / 1000 / 60).toFixed(2); //to minute
  }
}
