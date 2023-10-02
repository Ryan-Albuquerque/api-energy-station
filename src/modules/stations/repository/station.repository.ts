import { ObjectId } from "../../../utils/objectId";
import { CreateOrUpdateStationDTO } from "../dtos/create-or-update-station.dto";
import { StationModel } from "../model/station.model";
import { StationEntity } from "../station.entity";
import { IStationRepository } from "./station.repository.interface";

export class StationRepository implements IStationRepository {
  constructor(private readonly stationModel: typeof StationModel) {}
  async create(
    station: CreateOrUpdateStationDTO
  ): Promise<StationEntity | null> {
    return await this.stationModel.create(station);
  }
  async update(
    id: string,
    station: CreateOrUpdateStationDTO
  ): Promise<StationEntity | null> {
    if (!ObjectId.isValid(id)) {
      throw new Error(`id ${id} is invalid`);
    }

    return await this.stationModel.findByIdAndUpdate(id, station, {
      new: true,
    });
  }

  async getByPlanetName(planetName: string): Promise<StationEntity | null> {
    return await this.stationModel.findOne({ planetName });
  }

  async list(): Promise<StationEntity[] | null> {
    return await this.stationModel.find();
  }

  async getByName(name: string): Promise<StationEntity | null> {
    return await this.stationModel.findOne({
      name: name,
    });
  }
}
