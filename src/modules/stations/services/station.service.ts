import { CreateOrUpdateStationDTO } from "../dtos/create-or-update-station.dto";
import { IStationRepository } from "../repository/station.repository.interface";
import { IStationService } from "./station.service.interface";

export class StationService implements IStationService {
  constructor(private readonly stationRepository: IStationRepository) {}

  async list() {
    const stations = await this.stationRepository.list();

    if (!stations) {
      throw new Error("Not found any station");
    }

    return stations;
  }

  async getByName(name: string) {
    const station = await this.stationRepository.getByName(name);

    if (!station) {
      throw new Error(`Station ${name} not found`);
    }

    return station;
  }

  async getByPlanetName(name: string) {
    const station = await this.stationRepository.getByPlanetName(name);

    if (!station) {
      throw new Error(`Not found station in this planet`);
    }

    return station;
  }

  async create(station: CreateOrUpdateStationDTO) {
    const newStation = await this.stationRepository.create(station);

    if (!newStation) {
      throw new Error("Fail to create Station");
    }

    return newStation;
  }

  async update(id: string, station: CreateOrUpdateStationDTO) {
    const updatedStation = await this.stationRepository.update(id, station);

    if (!updatedStation) {
      throw new Error(`Fail to update Station with id ${id}`);
    }

    return updatedStation;
  }
}
