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
      const reservation = await this.reservationService.list(true);
      const recharge = await this.rechargeService.list(true);

      const reservationToTrigger = reservation.filter((res) => {
        return recharge.every(
          (rec) =>
            rec.stationName !== res.stationName && //means this station is not in use
            rec.userEmail !== res.userEmail //means this user is not recharging
        );
      });

      reservationToTrigger.forEach(async (res) => {
        try {
          await this.reservationService.triggerReservation(res._id.toString());

          console.log(
            `Starting recharge reservation(${res._id}) from ${res.stationName}`
          );

          const updateReservation: CreateOrUpdateReservationDto = {
            endDate: res.endDate,
            startDate: res.startDate,
            stationName: res.stationName,
            userEmail: res.userEmail,
            inProgress: true,
          };

          const updateInProgress = await this.reservationService.update(
            res._id.toString(),
            updateReservation
          );

          if (updateInProgress) {
            console.log(
              `Recharge reservation(${res._id}) from ${res.stationName} started`
            );
          }
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      console.error("Trigger recharge error: " + JSON.stringify(error));
    }
  }
}
