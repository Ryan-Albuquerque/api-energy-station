import { PlanetEntity } from "../entities/planet.entity";
import { SuitabilityPlanetEntity } from "../entities/suitability-planet.entity";

export abstract class IPlanetRepository {
  abstract listPlanet(): Promise<PlanetEntity[] | null>;
  abstract cleanAndCreateMany(
    planets: Partial<SuitabilityPlanetEntity | { hasStation: boolean }>[]
  ): Promise<PlanetEntity[]>;
}
