import { Types } from "mongoose";
import { UserEntity } from "../user.entity";

export class ResultUserDTO {
  public _id: string | Types.ObjectId;
  public name: string;
  public email: string;
  public createdAt?: Date | string;
  public updatedAt?: Date | string;

  constructor(user: UserEntity) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
