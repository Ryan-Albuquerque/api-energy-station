import { CreateStationDTO } from "../../dtos/create-station.dto";
import { UpdateStationDTO } from "../../dtos/update-station.dto";
import { IStationService } from "../../services/station.service.interface";
import { StationEntity } from "../../station.entity";
import { FixtureStationEntity } from "./data/fixture.main";

export const mockStationService: IStationService = {
  async getByName(_name: string): Promise<StationEntity> {
    return Promise.resolve(FixtureStationEntity);
  },
  async create(_data: CreateStationDTO): Promise<StationEntity> {
    return Promise.resolve(FixtureStationEntity);
  },
  async update(_id: string, _data: UpdateStationDTO): Promise<StationEntity> {
    return Promise.resolve(FixtureStationEntity);
  },
  async list(): Promise<StationEntity[]> {
    return Promise.resolve(new Array(10).fill(FixtureStationEntity));
  },
  async getByPlanetName(_planetName: string): Promise<StationEntity | null> {
    return Promise.resolve(FixtureStationEntity);
  },
};
