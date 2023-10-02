import { StationModel } from "../model/station.model";
import { StationEntity } from "../station.entity";
import { IStationRepository } from "./station.repository.interface";

export class StationRepository implements IStationRepository {
  constructor(private readonly stationModel: typeof StationModel) {}

  async getByPlanetName(planetName: string): Promise<StationEntity | null> {
    return await this.stationModel.findOne({ planetName });
  }
}
