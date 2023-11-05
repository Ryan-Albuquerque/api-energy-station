import axios from "axios";
import { SuitabilityPlanetEntity } from "../../entities/suitability-planet.entity";
import { IExternalPlanetServiceInterface } from "../external-planet.service.interface";
import { FAIL_TO_FETCH_PLANET_DATA } from "../../../../utils/errorMessages";

export class NasaService implements IExternalPlanetServiceInterface {
  static url =
    "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,%20pl_bmassj+from+ps+where+pl_bmassj+>10&format=json";

  async fetchPlanet(): Promise<SuitabilityPlanetEntity[]> {
    try {
      const { data } = await axios.get(NasaService.url);

      const suitabilityPlanets: SuitabilityPlanetEntity[] = [];

      for (const planet of data) {
        planet.pl_bmassj > 10
          ? suitabilityPlanets.push({
              mass: planet.pl_bmassj,
              name: planet.pl_name,
            })
          : undefined;
      }

      return suitabilityPlanets;
    } catch (error) {
      throw new Error(FAIL_TO_FETCH_PLANET_DATA);
    }
  }
}
