import { PlanetModel } from "../../planets/model/planet.model";
import { CreateStationDTO } from "../dtos/create-station.dto";
import { UpdateStationDTO } from "../dtos/update-station.dto";
import { StationModel } from "../model/station.model";
import { StationEntity } from "../station.entity";
import { IStationRepository } from "./station.repository.interface";

export class StationRepository implements IStationRepository {
  constructor(
    private readonly stationModel: typeof StationModel,
    private readonly planetModel: typeof PlanetModel
  ) {}
  async syncHasStationPlanetDB(station: StationEntity): Promise<void> {
    await this.planetModel.updateOne(
      {
        name: station.planetName,
      },
      {
        hasStation: true,
      }
    );
  }

  async list(): Promise<StationEntity[]> {
    return await this.stationModel.find();
  }

  async create(data: CreateStationDTO): Promise<StationEntity> {
    return await this.stationModel.create(data);
  }

  async update(
    id: string,
    station: UpdateStationDTO
  ): Promise<StationEntity | null> {
    const updated = await this.stationModel.findByIdAndUpdate(id, station, {
      new: true,
    });

    return updated;
  }

  async getByPlanetName(planetName: string): Promise<StationEntity | null> {
    return await this.stationModel.findOne({ planetName });
  }

  async getByName(name: string): Promise<StationEntity | null> {
    return await this.stationModel.findOne({
      name: name,
    });
  }
}
