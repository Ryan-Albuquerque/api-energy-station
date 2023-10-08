import { PlanetEntity } from "../entities/planet.entity";
import { SuitabilityPlanetWithStationEntity } from "../entities/suitability-planet-with-station-entity";
import { PlanetModel } from "../model/planet.model";
import { IPlanetRepository } from "./planet.repository.interface";

export class PlanetRepository implements IPlanetRepository {
  constructor(private readonly planetModel: typeof PlanetModel) {}
  async listPlanet(): Promise<PlanetEntity[]> {
    return await this.planetModel.find();
  }
  async updateDB(
    planets: SuitabilityPlanetWithStationEntity[]
  ): Promise<PlanetEntity[]> {
    await this.planetModel.deleteMany();

    return await this.planetModel.insertMany(planets);
  }
}
