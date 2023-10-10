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
              rec.stationName !== res.stationName ||
              rec.userEmail !== res.userEmail
          );
        }
      });

      for (const res of reservationToTrigger) {
        try {
          const updateInProgress = await this.reservationService.update(
            res._id.toString(),
            { isTrigged: true }
          );

          updateInProgress &&
            console.log(
              `Starting recharge reservation(${res._id}) from ${res.stationName}`
            );

          const { _id } = await this.reservationService.triggerReservation(
            res._id.toString()
          );

          if (_id) {
            console.log(
              `Recharge(${_id}) reservation(${res._id}) from ${res.stationName} started`
            );
          }
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error("Trigger recharge error: " + JSON.stringify(error));
    }
  }
}
