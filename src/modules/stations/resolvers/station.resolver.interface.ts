import { CreateOrUpdateStationDTO } from "../dtos/create-or-update-station.dto";
import { StationEntity } from "../station.entity";

export abstract class IStationResolver {
  abstract Query: {
    listStations: () => Promise<Partial<StationEntity>[]>;
  };

  abstract Mutation: {
    installStation: (
      _: any,
      { station }: { station: CreateOrUpdateStationDTO }
    ) => Promise<Partial<StationEntity>>;
    updateStation: (
      _: any,
      { id, station }: { id: string; station: CreateOrUpdateStationDTO }
    ) => Promise<Partial<StationEntity>>;
  };
}
