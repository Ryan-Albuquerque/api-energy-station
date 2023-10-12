import { z } from "zod";

export class CreateStationDTO {
  name: string;
  planetName: string;

  private static schema = z.object({
    planetName: z.string(),
    name: z.string(),
  });

  constructor(station: z.infer<typeof CreateStationDTO.schema>) {
    const validatedStation = CreateStationDTO.schema.safeParse(station);

    if (!validatedStation.success) {
      throw new Error(`Validation Error: ${validatedStation.error}`);
    }

    this.planetName = validatedStation.data.planetName;
    this.name = validatedStation.data.name;
  }
}
