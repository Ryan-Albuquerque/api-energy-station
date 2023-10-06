import { z } from "zod";
export class CreateRechargeDTO {
  stationName: string;
  userEmail: string;
  startDate: Date;
  endDate: Date;

  private static schema = z.object({
    stationName: z.string(),
    userEmail: z.string().email(),
    endDate: z.date(),
  });

  constructor(recharge: z.infer<typeof CreateRechargeDTO.schema>) {
    recharge.endDate = String(recharge.endDate);

    const validatedRecharge = CreateRechargeDTO.schema.safeParse(recharge);

    if (!validatedRecharge.success) {
      throw new Error(`Validation Error: ${validatedRecharge.error}`);
    }

    this.startDate = new Date();
    this.endDate = validatedRecharge.data.endDate;
    this.stationName = validatedRecharge.data.stationName;
    this.userEmail = validatedRecharge.data.userEmail;
  }
}
