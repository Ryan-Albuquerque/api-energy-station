import { StationEntity } from "../station.entity";
import { UpdateStationDTO } from "../dtos/update-station.dto";
import { CreateStationDTO } from "../dtos/create-station.dto";

export abstract class IStationRepository {
  abstract create(station: CreateStationDTO): Promise<StationEntity>;
  abstract update(
    id: string,
    station: UpdateStationDTO
  ): Promise<StationEntity | null>;
  abstract list(): Promise<StationEntity[]>;
  abstract getByName(name: string): Promise<StationEntity | null>;
  abstract getByPlanetName(planetName: string): Promise<StationEntity | null>;
  abstract syncHasStationPlanetDB(station: StationEntity): Promise<void>;
}
