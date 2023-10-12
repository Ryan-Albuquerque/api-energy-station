import { CreateStationDTO } from "../dtos/create-station.dto";
import { UpdateStationDTO } from "../dtos/update-station.dto";
import { StationEntity } from "../station.entity";

export abstract class IStationResolver {
  abstract Query: {
    listStations: () => Promise<Partial<StationEntity>[]>;
  };

  abstract Mutation: {
    installStation: (
      _: any,
      { station }: { station: CreateStationDTO }
    ) => Promise<Partial<StationEntity>>;
    updateStation: (
      _: any,
      { id, station }: { id: string; station: UpdateStationDTO }
    ) => Promise<Partial<StationEntity>>;
  };
}
