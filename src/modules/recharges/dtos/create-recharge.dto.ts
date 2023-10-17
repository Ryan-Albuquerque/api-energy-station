import { z } from "zod";
export class CreateRechargeDTO {
  stationName: string;
  userEmail: string;
  startDate: Date;
  endDate: Date;
  totalTime?: number;

  private static schema = z.object({
    stationName: z.string(),
    userEmail: z.string().email(),
    endDate: z.date(),
    totalTime: z.number().optional(),
    startDate: z.date(),
  });

  constructor(recharge: z.infer<typeof CreateRechargeDTO.schema>) {
    const validatedRecharge = CreateRechargeDTO.schema.safeParse(recharge);

    if (!validatedRecharge.success) {
      throw new Error(`Validation Error: ${validatedRecharge.error}`);
    }

    this.startDate = validatedRecharge.data.startDate;
    this.endDate = validatedRecharge.data.endDate;
    this.stationName = validatedRecharge.data.stationName;
    this.userEmail = validatedRecharge.data.userEmail;
    this.totalTime = validatedRecharge.data.totalTime;
  }
}
