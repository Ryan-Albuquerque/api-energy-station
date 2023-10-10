import { CreateOrUpdateReservationDto } from "../../reservation/dtos/create-or-update-reservation.dto";
import { IReservationService } from "../../reservation/services/reservation.service.interface";
import { IRechargeService } from "../services/recharge.service.interface";
import { IRechargeCron } from "./recharge.cron.interface";

export class RechargeCron implements IRechargeCron {
  constructor(
    private readonly reservationService: IReservationService,
    private readonly rechargeService: IRechargeService
  ) {}
  async watchReservationAndTriggerRecharge() {
    try {
      const now = new Date();
      const reservation = await this.reservationService.list(true);
      const recharge = await this.rechargeService.list(true);

      const reservationToTrigger = reservation.filter((res) => {
        if (res.isTrigged == false && now >= res.startDate) {
          return recharge.every(
            (rec) =>
              res.stationName !== rec.stationName &&
              rec.userEmail !== res.userEmail
          );
        }
      });

      reservationToTrigger.forEach(async (res) => {
        try {
          const updateReservation: CreateOrUpdateReservationDto = {
            endDate: res.endDate,
            startDate: res.startDate,
            stationName: res.stationName,
            userEmail: res.userEmail,
            isTrigged: true,
          };

          const updateInProgress = await this.reservationService.update(
            res._id.toString(),
            updateReservation
          );

          updateInProgress &&
            console.log(
              `Starting recharge reservation(${res._id}) from ${res.stationName}`
            );

          (await this.reservationService.triggerReservation(
            res._id.toString()
          )) &&
            console.log(
              `Recharge reservation(${res._id}) from ${res.stationName} started`
            );
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      console.error("Trigger recharge error: " + JSON.stringify(error));
    }
  }
}
