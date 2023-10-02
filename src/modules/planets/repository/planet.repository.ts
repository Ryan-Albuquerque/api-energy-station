import { PlanetEntity } from "../entities/planet.entity";
import { SuitabilityPlanetEntity } from "../entities/suitability-planet.entity";
import { PlanetModel } from "../model/planet.model";
import { IPlanetRepository } from "./planet.repository.interface";

export class PlanetRepository implements IPlanetRepository {
  constructor(private readonly planetModel: typeof PlanetModel) {}
  async listPlanet(): Promise<PlanetEntity[] | null> {
    return await this.planetModel.find();
  }
  async cleanAndCreateMany(
    planets: Partial<SuitabilityPlanetEntity | { hasStation: boolean }>[]
  ): Promise<PlanetEntity[]> {
    await this.planetModel.deleteMany();

    return await this.planetModel.insertMany(planets);
  }
}
