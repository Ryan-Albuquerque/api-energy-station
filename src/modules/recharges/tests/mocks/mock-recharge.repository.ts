import { CreateStationDTO } from "../../dtos/create-station.dto";
import { UpdateStationDTO } from "../../dtos/update-station.dto";
import { IStationRepository } from "../../repository/station.repository.interface";
import { StationEntity } from "../../station.entity";
import { FixtureStationEntity } from "./data/fixture.main";

export const mockStationRepository: IStationRepository = {
  async create(_station: CreateStationDTO): Promise<StationEntity> {
    return Promise.resolve(FixtureStationEntity);
  },
  async update(
    _id: string,
    _data: UpdateStationDTO
  ): Promise<StationEntity | null> {
    return Promise.resolve(FixtureStationEntity);
  },
  async list(): Promise<StationEntity[]> {
    return Promise.resolve(new Array(10).fill(FixtureStationEntity));
  },
  async getByName(_name: string): Promise<StationEntity | null> {
    return Promise.resolve(FixtureStationEntity);
  },
  async getByPlanetName(_planetName: string): Promise<StationEntity | null> {
    return Promise.resolve(FixtureStationEntity);
  },
  async syncHasStationPlanetDB(_station: StationEntity): Promise<void> {
    return Promise.resolve();
  },
};
