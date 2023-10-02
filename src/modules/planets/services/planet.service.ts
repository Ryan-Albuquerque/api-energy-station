import { IStationRepository } from "../../stations/repository/station.repository.interface";
import { PlanetEntity } from "../entities/planet.entity";
import { SuitabilityPlanetEntity } from "../entities/suitability-planet.entity";
import { IExternalPlanetServiceInterface } from "../external/external-planet.service.interface";
import { IPlanetRepository } from "../repository/planet.repository.interface";
import { IPlanetService } from "./planet.service.interface";

export class PlanetService implements IPlanetService {
  constructor(
    private readonly externalPlanetService: IExternalPlanetServiceInterface,
    private readonly planetRepository: IPlanetRepository,
    private readonly stationRepository: IStationRepository
  ) {}
  async getPlanets(): Promise<PlanetEntity[] | null> {
    let result = await this.planetRepository.listPlanet();
    let newPlanets: Partial<
      SuitabilityPlanetEntity | { hasStation: boolean }
    >[] = [];

    const now = new Date();

    const shouldUpdate = result?.some(
      (el) =>
        el?.updatedAt &&
        new Date(
          el?.updatedAt.getFullYear(),
          el?.updatedAt.getMonth(),
          el?.updatedAt.getDate()
        ) <= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    );

    if (result?.length == 0 || shouldUpdate) {
      const planetsFetched = await this.externalPlanetService.fetchPlanet();
      if (!planetsFetched) {
        throw new Error("No plants found");
      }

      for (const planet of planetsFetched) {
        const hasStationInPlanet = await this.stationRepository.getByPlanetName(
          planet.name
        );

        const planetData = {
          ...planet,
          hasStation: Boolean(hasStationInPlanet) ?? false,
        };

        newPlanets.push(planetData);
      }
      result = await this.planetRepository.cleanAndCreateMany(newPlanets);
    }

    return result;
  }
}
