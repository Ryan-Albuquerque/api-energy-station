import { Schema, model } from "mongoose";

const RechargeSchema = new Schema({
  stationName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

export const RechargeModel = model("Recharge", RechargeSchema);
