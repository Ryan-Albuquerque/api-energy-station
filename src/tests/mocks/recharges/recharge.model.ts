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
  totalTime: {
    type: Number,
    required: false,
  },
});

export const RechargeModel = model("Recharge", RechargeSchema);
