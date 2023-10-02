import { CreateOrUpdateStationDTO } from "../dtos/create-or-update-station.dto";
import { StationEntity } from "../station.entity";

export abstract class IStationService {
  abstract create(data: CreateOrUpdateStationDTO): Promise<StationEntity>;
  abstract update(
    id: string,
    data: CreateOrUpdateStationDTO
  ): Promise<StationEntity>;
  abstract getByName(name: string): Promise<StationEntity>;
  abstract list(): Promise<StationEntity[]>;
  abstract getByPlanetName(name: string): Promise<StationEntity | null>;
}
