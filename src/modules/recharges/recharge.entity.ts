import { Types } from "mongoose";

export type RechargeEntity = {
  _id: string | Types.ObjectId;
  stationName: string;
  userEmail: string;
  totalTime?: string;
  startDate: Date | string;
  endDate: Date | string;
};
