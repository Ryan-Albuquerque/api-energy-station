import { CreateOrUpdateStationDTO } from "../dtos/create-or-update-station.dto";
import { StationEntity } from "../station.entity";

export abstract class IStationRepository {
  abstract create(station: CreateOrUpdateStationDTO): Promise<StationEntity>;
  abstract update(
    id: string,
    station: CreateOrUpdateStationDTO
  ): Promise<StationEntity | null>;
  abstract list(): Promise<StationEntity[]>;
  abstract getByName(name: string): Promise<StationEntity | null>;
  abstract getByPlanetName(planetName: string): Promise<StationEntity | null>;
  abstract syncHasStationPlanetDB(station: StationEntity): Promise<void>;
}
