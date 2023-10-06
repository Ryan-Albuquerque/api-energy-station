import { PlanetEntity } from "../entities/planet.entity";

export abstract class IPlanetService {
  abstract getPlanets(): Promise<PlanetEntity[]>;
}
