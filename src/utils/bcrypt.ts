import bcrypt from "bcrypt";

export class BcryptUtils {
  public static async hash(value: string) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(value, saltRounds);

    return hashed;
  }

  public static async compare(value: string, hashedValue: string) {
    return await bcrypt.compare(value, hashedValue);
  }
}
