import bcrypt from "bcrypt";

export class BcryptUtils {
  public static async hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }
}
