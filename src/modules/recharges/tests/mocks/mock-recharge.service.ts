import { IRechargeService } from "../../services/recharge.service.interface";
import { RechargeEntity } from "../../entities/recharge.entity";
import { FixtureRechargeEntity } from "./data/fixture.main";
import { CreateRechargeRequestDTO } from "../../dtos/create-recharge-request.dto";
import { HistoryRechargeInStation } from "../../entities/history-recharge-in-station.entity";

export const mockRechargeService: IRechargeService = {
  async listHistoryFromAStation(
    _stationName: string
  ): Promise<HistoryRechargeInStation> {
    return Promise.resolve({
      recharges: new Array(10).fill(FixtureRechargeEntity),
      totalTime: 1,
    });
  },
  async list(fromNow?: boolean | undefined): Promise<RechargeEntity[]> {
    const fromNowDocs = new Array(10).fill(FixtureRechargeEntity);
    if (fromNow) {
      return Promise.resolve(fromNowDocs);
    }

    var startDateMock = new Date();

    startDateMock.setDate(startDateMock.getDate() - 2);
    var endDateMock = new Date();

    endDateMock.setDate(endDateMock.getDate() - 1);

    const pastDoc = {
      ...FixtureRechargeEntity,
      startDate: startDateMock,
      endDate: endDateMock,
    };

    return Promise.resolve([...fromNowDocs, ...new Array(10).fill(pastDoc)]);
  },
  async create(_data: CreateRechargeRequestDTO): Promise<RechargeEntity> {
    return Promise.resolve(FixtureRechargeEntity);
  },
};
