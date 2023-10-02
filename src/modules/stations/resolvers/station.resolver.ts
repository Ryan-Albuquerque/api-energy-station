import { CreateOrUpdateStationDTO } from "../dtos/create-or-update-station.dto";
import { IStationService } from "../services/station.service.interface";
import { IStationResolver } from "./station.resolver.interface";

export class StationResolver implements IStationResolver {
  constructor(private stationService: IStationService) {}

  Mutation = {
    installStation: async (
      _: any,
      { station }: { station: CreateOrUpdateStationDTO }
    ) => {
      const request = new CreateOrUpdateStationDTO(station);

      return await this.stationService.create(request);
    },
    updateStation: async (
      _: any,
      { id, station }: { id: string; station: CreateOrUpdateStationDTO }
    ) => {
      const request = new CreateOrUpdateStationDTO(station);

      return await this.stationService.update(id, request);
    },
  };

  Query = {
    stations: async () => {
      return await this.stationService.list();
    },
  };
}
