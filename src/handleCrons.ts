import { CronJob } from "cron";
import { RechargeCron } from "./modules/recharges/cron/recharge.cron";
import { reservationModule } from "./modules/reservation/main";
import { rechargeModule } from "./modules/recharges/main";

const main = () => {
  const handleTriggerRecharge = new RechargeCron(
    reservationModule.reservationService,
    rechargeModule.rechargeService
  );

  const job = new CronJob("*/2 * * * * *", function () {
    handleTriggerRecharge.watchReservationAndTriggerRecharge();
  });
  if (!job.running) {
    job.start();
  }
};

export const crons = main();
