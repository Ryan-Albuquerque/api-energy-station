import { IPlanetService } from "../services/planet.service.interface";
import { IPlanetResolver } from "./planet.resolver.interface";

export class PlanetResolver implements IPlanetResolver {
  constructor(private readonly planetService: IPlanetService) {}

  public Query = {
    suitablePlanets: async () => {
      return await this.planetService.getPlanets();
    },
  };
}
