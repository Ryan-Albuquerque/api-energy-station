import { z } from "zod";

export class UpdateStationDTO {
  name?: string;
  planetName?: string;

  private static schema = z.object({
    planetName: z.string().optional(),
    name: z.string().optional(),
  });

  constructor(station: z.infer<typeof UpdateStationDTO.schema>) {
    const validatedStation = UpdateStationDTO.schema.safeParse(station);

    if (!validatedStation.success) {
      throw new Error(`Validation Error: ${validatedStation.error}`);
    }

    this.planetName = validatedStation.data.planetName;
    this.name = validatedStation.data.name;
  }
}
