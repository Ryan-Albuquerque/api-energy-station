import { RechargeEntity } from "./recharge.entity";

export type HistoryRechargeInStation = {
  recharges: RechargeEntity[];
  totalTime: number;
};
