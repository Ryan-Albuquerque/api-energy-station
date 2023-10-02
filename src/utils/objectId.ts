import { Types } from "mongoose";

export class ObjectId {
  static isValid(id: string) {
    return Types.ObjectId.isValid(id);
  }
}
