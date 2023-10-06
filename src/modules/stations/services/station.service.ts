import { CreateOrUpdateStationDTO } from "../dtos/create-or-update-station.dto";
import { IStationRepository } from "../repository/station.repository.interface";
import { IStationService } from "./station.service.interface";

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

  private async isUniqueStationInPlanet(
    planet: string,
    name: string
  ): Promise<boolean> {
    const station = await this.getByName(name);

    return station && station?.planetName == planet ? false : true;
  }

  async create(station: CreateOrUpdateStationDTO) {
    if (
      !(await this.isUniqueStationInPlanet(station.planetName, station.name))
    ) {
      throw new Error(
        "Should be unique planet - and registered in database - and station name"
      );
    }

    const newStation = await this.stationRepository.create(station);

    if (!newStation) {
      throw new Error("Fail to create Station");
    }

    await this.stationRepository.syncHasStationPlanetDB(newStation);

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
