import { Schema, model } from "mongoose";

const StationSchema = new Schema(
  {
    planetName: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const StationModel = model("Station", StationSchema);
