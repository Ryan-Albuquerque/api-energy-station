import { CreateOrUpdateStationDTO } from "../dtos/create-or-update-station.dto";
import { IStationRepository } from "../repository/station.repository.interface";
import { IStationService } from "./station.service.interface";
import { ObjectId } from "../../../utils/objectId";

export class StationService implements IStationService {
  constructor(private readonly stationRepository: IStationRepository) {}

  async list() {
    return await this.stationRepository.list();
  }

  async getByName(name: string) {
    return await this.stationRepository.getByName(name);
  }

  async getByPlanetName(name: string) {
    return await this.stationRepository.getByPlanetName(name);
  }

  async create(station: CreateOrUpdateStationDTO) {
    const newStation = await this.stationRepository.create(station);

    if (!newStation) {
      throw new Error("Fail to create Station");
    }

    return newStation;
  }

  async update(id: string, station: CreateOrUpdateStationDTO) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid Id");
    }

    const updatedStation = await this.stationRepository.update(id, station);

    if (!updatedStation) {
      throw new Error(`Fail to update Station with id ${id}`);
    }

    return updatedStation;
  }
}
