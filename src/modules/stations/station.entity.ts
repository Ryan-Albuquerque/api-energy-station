import { Types } from "mongoose";

export type StationEntity = {
  _id: string | Types.ObjectId;
  name: string;
  planetName: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
