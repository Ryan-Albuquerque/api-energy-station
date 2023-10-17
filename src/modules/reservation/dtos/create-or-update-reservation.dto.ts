import { z } from "zod";

export class CreateOrUpdateReservationDto {
  stationName: string;
  userEmail: string;
  startDate: Date;
  endDate: Date;
  isTrigged?: boolean;

  private static schema = z.object({
    stationName: z.string(),
    userEmail: z.string().email(),
    startDate: z.date(),
    endDate: z.date(),
    isTrigged: z.boolean().optional(),
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
    this.isTrigged = validatedRecharge.data.isTrigged;
  }
}
