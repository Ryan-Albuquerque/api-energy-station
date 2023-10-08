import { Schema, model } from "mongoose";

const PlanetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mass: {
      type: Number,
      required: true,
    },
    hasStation: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const PlanetModel = model("Planet", PlanetSchema);
