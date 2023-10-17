import { CreateStationDTO } from "../dtos/create-station.dto";
import { UpdateStationDTO } from "../dtos/update-station.dto";
import { StationEntity } from "../station.entity";

export abstract class IStationService {
  abstract create(data: CreateStationDTO): Promise<StationEntity>;
  abstract update(id: string, data: UpdateStationDTO): Promise<StationEntity>;
  abstract getByName(name: string): Promise<StationEntity | null>;
  abstract list(): Promise<StationEntity[]>;
  abstract getByPlanetName(name: string): Promise<StationEntity | null>;
}
