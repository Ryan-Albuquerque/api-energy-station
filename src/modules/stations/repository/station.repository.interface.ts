import { StationEntity } from "../station.entity";

export abstract class IStationRepository {
  abstract getByPlanetName(planetName: string): Promise<StationEntity | null>;
}
