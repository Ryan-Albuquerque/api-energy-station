import { PlanetModel } from "../planets/model/planet.model";
import { StationModel } from "./model/station.model";
import { StationRepository } from "./repository/station.repository";
import { StationResolver } from "./resolvers/station.resolver";
import { StationService } from "./services/station.service";

const main = () => {
  const stationRepository = new StationRepository(StationModel, PlanetModel);
  const stationService = new StationService(stationRepository);

  const { Mutation, Query } = new StationResolver(stationService);

  return { Mutation, Query, stationService };
};

export const stationModule = main();
