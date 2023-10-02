import { Schema, model } from "mongoose";

const ReservationSchema = new Schema({
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

export const ReservationModel = model("Reservation", ReservationSchema);
