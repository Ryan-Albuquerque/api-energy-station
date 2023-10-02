import { ObjectId } from "../../../utils/objectId";
import { ReservationModel } from "../../reservation/model/reservation.model";
import { ReservationEntity } from "../../reservation/reservation.entity";
import { CreateRechargeDTO } from "../dtos/create-recharge.dto";
import { RechargeModel } from "../model/recharge.model";
import { RechargeEntity } from "../recharge.entity";
import { IRechargeRepository } from "./recharge.repository.interface";

export class RechargeRepository implements IRechargeRepository {
  constructor(
    private readonly rechargeModel: typeof RechargeModel,
    private readonly reservationModel: typeof ReservationModel
  ) {}
  async list(): Promise<RechargeEntity[] | null> {
    return await this.rechargeModel.find();
  }
  async listByStationName(
    stationName: string
  ): Promise<RechargeEntity[] | null> {
    return await this.rechargeModel.find({
      stationName: stationName,
    });
  }
  async getById(id: string): Promise<RechargeEntity | null> {
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid id`);
    }
    return await this.rechargeModel.findById(id);
  }
  async create(recharge: CreateRechargeDTO): Promise<RechargeEntity | null> {
    return await this.rechargeModel.create(recharge);
  }
  async update(
    id: string,
    recharge: CreateRechargeDTO
  ): Promise<RechargeEntity | null> {
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid id`);
    }

    return await this.rechargeModel.findByIdAndUpdate(id, recharge, {
      new: true,
    });
  }
  async getActiveRecharges(): Promise<RechargeEntity[] | null> {
    const dateNow = new Date();
    return await this.rechargeModel.find({
      $and: [
        {
          endDate: {
            $gte: dateNow,
          },
        },
        {
          startDate: {
            $lt: dateNow,
          },
        },
      ],
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
