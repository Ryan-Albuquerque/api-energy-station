import { PlanetEntity } from "../entities/planet.entity";
import { SuitabilityPlanetWithStationEntity } from "../entities/suitability-planet-with-station-entity";

export abstract class IPlanetRepository {
  abstract listPlanet(): Promise<PlanetEntity[]>;
  abstract updateDB(
    planets: SuitabilityPlanetWithStationEntity[]
  ): Promise<PlanetEntity[]>;
}
