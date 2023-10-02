import { PlanetModel } from "./model/planet.model";
import { PlanetRepository } from "./repository/planet.repository";
import { PlanetResolver } from "./resolvers/planet.resolver";
import { PlanetService } from "./services/planet.service";
import { NasaService } from "./external/nasa/nasa.service";
import { stationModule } from "../stations/main";

const main = () => {
  const nasaService = new NasaService();
  const planetRepository = new PlanetRepository(PlanetModel);
  const planetService = new PlanetService(
    nasaService,
    planetRepository,
    stationModule.stationRepository
  );
  const { Query } = new PlanetResolver(planetService);

  return { Query };
};

export const planetModule = main();
