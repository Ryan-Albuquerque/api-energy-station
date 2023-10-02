import { SuitabilityPlanetEntity } from "../entities/suitability-planet.entity";

export abstract class IExternalPlanetServiceInterface {
  abstract fetchPlanet(): Promise<SuitabilityPlanetEntity[]>;
}
