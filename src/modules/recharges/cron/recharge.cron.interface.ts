export abstract class IRechargeCron {
  abstract watchReservationAndTriggerRecharge(id: string): void;
}
