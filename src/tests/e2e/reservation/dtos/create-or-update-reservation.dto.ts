import { z } from "zod";

export class CreateOrUpdateReservationDto {
  stationName: string;
  userEmail: string;
  startDate: Date;
  endDate: Date;

  private static schema = z.object({
    stationName: z.string(),
    userEmail: z.string().email(),
    startDate: z.date(),
    endDate: z.date(),
  });

  constructor(recharge: z.infer<typeof CreateOrUpdateReservationDto.schema>) {
    recharge.endDate = new Date(recharge.endDate);
    recharge.startDate = new Date(recharge.startDate);

    const validatedRecharge =
      CreateOrUpdateReservationDto.schema.safeParse(recharge);

    if (!validatedRecharge.success) {
      throw new Error(`Validation Error: ${validatedRecharge.error}`);
    }

    this.stationName = validatedRecharge.data.stationName;
    this.userEmail = validatedRecharge.data.userEmail;
    this.startDate = validatedRecharge.data.startDate;
    this.endDate = validatedRecharge.data.endDate;
  }
}
