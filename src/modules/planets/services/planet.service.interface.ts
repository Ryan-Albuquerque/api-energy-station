import { PlanetEntity } from "../entities/planet.entity";

export interface IPlanetService {
  getPlanets(): Promise<PlanetEntity[] | null>;
}
