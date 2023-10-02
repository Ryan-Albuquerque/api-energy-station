import { PlanetEntity } from "../entities/planet.entity";

export abstract class IPlanetResolver {
  abstract Query: {
    suitablePlanets: () => Promise<PlanetEntity[] | null>;
  };
}
