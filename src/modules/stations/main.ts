import { StationModel } from "./model/station.model";
import { StationRepository } from "./repository/station.repository";

const main = () => {
  const stationRepository = new StationRepository(StationModel);

  return { stationRepository };
};

export const stationModule = main();
