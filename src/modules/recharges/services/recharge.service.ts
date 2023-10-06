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
    await this.ValidateParamsInBusinessRule(
      userEmail,
      stationName,
      startDate,
      endDate
    );

    if (await this.isStationInUseOrUserRecharging(stationName, userEmail)) {
      throw new Error("Station in use or user already recharding");
    }

    // const reservations =
    //   await this.rechargeRepository.listReservationByStationName(stationName);

    // this.isStationAlreadyReserved(
    //   reservations,
    //   new Date(startDate),
    //   new Date(endDate)
    // );

    const totalTime = this.calculateTotalMinutes(endDate, startDate);

    const created = await this.rechargeRepository.create({
      endDate,
      startDate,
      stationName,
      userEmail,
      totalTime: Number.parseFloat(totalTime),
    });

    if (!created) {
      throw new Error("Fail to create a recharding");
    }

    return created;
  }

  async list() {
    return await this.rechargeRepository.list();
  }

  // async getHistoryFromStation(stationName: string) {
  //   const recharges = await this.rechargeRepository.listByStationName(
  //     stationName
  //   );

  //   if (!recharges) {
  //     throw new Error(`Not found Recharges with station name ${stationName}`);
  //   }

  //   const rechargesWithTotalHours = this.calcTotalHour(recharges);

  //   return rechargesWithTotalHours;
  // }

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

  // private isStationAlreadyReserved(
  //   reservations: ReservationEntity[],
  //   startDate: Date,
  //   endDate: Date
  // ) {
  //   return reservations.some(
  //     (res) => endDate >= res.startDate && startDate <= res.endDate
  //   );
  // }

  private calculateTotalMinutes(endDate: Date, startDate: Date) {
    const timeInMs = endDate.getTime() - startDate.getTime();

    return (timeInMs / 1000 / 60).toFixed(2); //to minute
  }

  // private calcTotalHour(recharges: RechargeEntity[]): RechargeEntity[] {
  //   recharges.map((rec) => {
  //     const timeInMs =
  //       new Date(rec.endDate).getTime() - new Date(rec.startDate).getTime();

  //     const timeInHourFormated = (timeInMs / 1000 / 60 / 60).toFixed(3);
  //     rec.totalTime = `${timeInHourFormated} hours`;
  //   });

  //   return recharges;
  // }
}
