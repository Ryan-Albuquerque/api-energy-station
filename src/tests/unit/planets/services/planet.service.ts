import { IStationService } from "../../stations/services/station.service.interface";
import { PlanetEntity } from "../entities/planet.entity";
import { SuitabilityPlanetWithStationEntity } from "../entities/suitability-planet-with-station-entity";
import { IExternalPlanetServiceInterface } from "../external/external-planet.service.interface";
import { IPlanetRepository } from "../repository/planet.repository.interface";
import { IPlanetService } from "./planet.service.interface";

export class PlanetService implements IPlanetService {
  constructor(
    private readonly externalPlanetService: IExternalPlanetServiceInterface,
    private readonly planetRepository: IPlanetRepository,
    private readonly stationService: IStationService
  ) {}
  async getPlanets(): Promise<PlanetEntity[]> {
    let result = await this.planetRepository.listPlanet();
    let newPlanets: SuitabilityPlanetWithStationEntity[] = [];

    const now = new Date();

    const shouldUpdate = result?.some(
      (el) =>
        el?.updatedAt &&
        new Date(
          el?.updatedAt.getFullYear(),
          el?.updatedAt.getMonth(),
          el?.updatedAt.getDate()
        ) <= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5)
    );

    if (!result || shouldUpdate) {
      const planetsFetched = await this.externalPlanetService.fetchPlanet();
      if (!planetsFetched) {
        return [];
      }

      for (const planet of planetsFetched) {
        const hasStationInPlanet = Boolean(
          await this.stationService.getByPlanetName(planet.name)
        );

        const planetData = {
          ...planet,
          hasStation: hasStationInPlanet ?? false,
        };

        newPlanets.push(planetData);
      }
      result = await this.planetRepository.updateDB(newPlanets);
    }

    return result;
  }
}
