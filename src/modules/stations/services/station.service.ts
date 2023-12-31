import {
  FAIL_TO_UPDATE_WITH_ID,
  ID_IS_NOT_VALID,
  SHOULD_BE_UNIQUE_PLANET,
} from "../../../utils/errorMessages";
import { ObjectId } from "../../../utils/objectId";
import { CreateStationDTO } from "../dtos/create-station.dto";
import { UpdateStationDTO } from "../dtos/update-station.dto";
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

  private async isNotUniqueStationInPlanet(
    planet: string,
    name: string
  ): Promise<boolean> {
    const stations = await this.list();

    if (stations.length > 0) {
      return stations.some((st) => {
        return st.name == name || st.planetName == planet;
      });
    }
    return false;
  }

  async create(station: CreateStationDTO) {
    const isNotUniqueStationInPlanet = await this.isNotUniqueStationInPlanet(
      station.planetName,
      station.name
    );
    if (isNotUniqueStationInPlanet) {
      throw new Error(SHOULD_BE_UNIQUE_PLANET);
    }

    const newStation = await this.stationRepository.create(station);

    await this.stationRepository.syncHasStationPlanetDB(newStation);

    return newStation;
  }

  async update(id: string, station: UpdateStationDTO) {
    if (!ObjectId.isValid(id)) {
      throw new Error(ID_IS_NOT_VALID);
    }
    const updatedStation = await this.stationRepository.update(id, station);

    if (!updatedStation) {
      throw new Error(FAIL_TO_UPDATE_WITH_ID + id);
    }

    return updatedStation;
  }
}
