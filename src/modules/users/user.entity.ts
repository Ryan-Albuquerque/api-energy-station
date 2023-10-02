import { Types } from "mongoose";

export type User = {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};
