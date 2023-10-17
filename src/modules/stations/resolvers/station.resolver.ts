import { CreateStationDTO } from "../dtos/create-station.dto";
import { UpdateStationDTO } from "../dtos/update-station.dto";
import { IStationService } from "../services/station.service.interface";
import { IStationResolver } from "./station.resolver.interface";

export class StationResolver implements IStationResolver {
  constructor(private stationService: IStationService) {}

  Mutation = {
    installStation: async (
      _: any,
      { station }: { station: CreateStationDTO }
    ) => {
      const request = new CreateStationDTO(station);

      return await this.stationService.create(request);
    },
    updateStation: async (
      _: any,
      { id, station }: { id: string; station: UpdateStationDTO }
    ) => {
      const request = new UpdateStationDTO(station);

      return await this.stationService.update(id, request);
    },
  };

  Query = {
    listStations: async () => {
      return await this.stationService.list();
    },
  };
}
