import jwt from "jsonwebtoken";

export class JwtUtils {
  public static sign(payload: object, isLogin?: boolean) {
    return jwt.sign({ ...payload }, process.env.JWT_SECRET as string, {
      expiresIn: isLogin ? "1d" : "",
    });
  }
  public static verify(token: string, returnedProps: string[]) {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as jwt.JwtPayload;

      const validProps = Object.keys(payload).filter((key) => {
        if (returnedProps?.includes(key)) return key;
      });

      let obj = Object.fromEntries(validProps.map((e) => [e, null]));

      return ({ ...obj } = payload);
    } catch (err) {
      throw err;
    }
  }
}
