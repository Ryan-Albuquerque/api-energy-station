import { ReservationModel } from "../../reservation/model/reservation.model";
import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { RechargeModel } from "../model/recharge.model";
import { RechargeEntity } from "../entities/recharge.entity";
import { IRechargeRepository } from "./recharge.repository.interface";
import { ReservationEntity } from "../../reservation/reservation.entity";

export class RechargeRepository implements IRechargeRepository {
  constructor(
    private readonly rechargeModel: typeof RechargeModel,
    private readonly reservationModel: typeof ReservationModel
  ) {}
  async list(fromNow?: boolean): Promise<RechargeEntity[]> {
    const dateNow = new Date();

    const options = fromNow
      ? {
          $and: [
            {
              endDate: {
                $gt: dateNow,
              },
            },
            {
              startDate: {
                $lte: dateNow,
              },
            },
          ],
        }
      : undefined;

    return await this.rechargeModel.find({ ...options });
  }
  async listByStationName(stationName: string): Promise<RechargeEntity[]> {
    return await this.rechargeModel.find({
      stationName: stationName,
    });
  }
  async getById(id: string): Promise<RechargeEntity | null> {
    return await this.rechargeModel.findById(id);
  }
  async create(recharge: CreateRechargeDTO): Promise<RechargeEntity> {
    return await this.rechargeModel.create(recharge);
  }
  async update(
    id: string,
    recharge: CreateRechargeDTO
  ): Promise<RechargeEntity | null> {
    return await this.rechargeModel.findByIdAndUpdate(id, recharge, {
      new: true,
    });
  }
  async listReservationByStationName(
    stationName: string
  ): Promise<ReservationEntity[]> {
    return await this.reservationModel.find({
      stationName: stationName,
    });
  }
}
