import { Types } from "mongoose";

export type PlanetEntity = {
  _id: string | Types.ObjectId;
  hasStation: boolean;
  name: string;
  mass: number;
  createdAt?: Date;
  updatedAt?: Date;
};
