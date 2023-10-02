import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { IRechargeRepository } from "../repository/recharge.repository.interface";
import { IRechargeService } from "./recharge.service.interface";
import { IUserService } from "../../users/services/user.service.interface";
import { IStationService } from "../../stations/services/station.service.interface";
import { RechargeEntity } from "../recharge.entity";
import { ReservationEntity } from "../../reservation/reservation.entity";

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
  }: CreateRechargeDTO) {
    this.isEndDateValid(endDate);

    await this.userService.getByEmail(userEmail);
    await this.stationService.getByName(stationName);

    const recharges = await this.rechargeRepository.list();

    if (
      await this.isStationInUseOrUserRecharging(
        recharges,
        stationName,
        userEmail
      )
    ) {
      throw new Error("Station in use or user already recharding");
    }

    const reservations =
      await this.rechargeRepository.listReservationByStationName(stationName);

    this.isStationAlreadyReserved(
      reservations,
      new Date(startDate),
      new Date(endDate)
    );

    const created = await this.rechargeRepository.create({
      endDate,
      startDate,
      stationName,
      userEmail,
    });

    if (!created) {
      throw new Error("Fail to create a recharding");
    }

    return created;
  }

  private async isStationInUseOrUserRecharging(
    recharges: RechargeEntity[] | null,
    stationName: string,
    userEmail: string
  ) {
    return recharges?.some(
      (rec) =>
        new Date(rec.endDate) > new Date() &&
        new Date() >= new Date(rec.startDate) &&
        rec.stationName == stationName &&
        rec.userEmail == userEmail
    );
  }

  async list() {
    const recharges = await this.rechargeRepository.list();

    if (!recharges) {
      throw new Error("No recharges found");
    }

    return recharges;
  }

  async getHistoryFromStation(stationName: string) {
    const recharges = await this.rechargeRepository.listByStationName(
      stationName
    );

    if (!recharges) {
      throw new Error(`Not found Recharges with station name ${stationName}`);
    }

    const rechargesWithTotalHours = this.calcTotalHour(recharges);

    return rechargesWithTotalHours;
  }

  async getById(id: string) {
    const recharge = await this.rechargeRepository.getById(id);

    if (!recharge) {
      throw new Error(`Not found with id ${id}`);
    }

    return recharge;
  }

  private isEndDateValid(endDate: string | Date) {
    const isEndDateValid = new Date(endDate) > new Date();
    if (!isEndDateValid) {
      throw new Error(
        "Informed endDate is invalid, should be greater than now"
      );
    }
  }

  private isStationAlreadyReserved(
    reservations: ReservationEntity[],
    startDate: Date,
    endDate: Date
  ) {
    return reservations.some(
      (res) => endDate >= res.startDate && startDate <= res.endDate
    );
  }

  private calcTotalHour(recharges: RechargeEntity[]): RechargeEntity[] {
    recharges.map((rec) => {
      const timeInMs =
        new Date(rec.endDate).getTime() - new Date(rec.startDate).getTime();

      const timeInHourFormated = (timeInMs / 1000 / 60 / 60).toFixed(3);
      rec.totalTime = `${timeInHourFormated} hours`;
    });

    return recharges;
  }
}
