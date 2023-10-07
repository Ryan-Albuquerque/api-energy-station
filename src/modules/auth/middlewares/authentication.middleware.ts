import { rule } from "graphql-shield";
import { IAuthenticationMiddleware } from "./authentication.middleware.interface";
import { JwtUtils } from "../../../utils/jwt";

export class AuthenticationMiddleware implements IAuthenticationMiddleware {
  constructor() {}

  auth() {
    return rule()(async (parent, args, context, info) => {
      const authHeader = context.req.headers?.authorization;
      const token = authHeader.split("Bearer ")[1];

      if (token) {
        const { id } = JwtUtils.verify(token, ["id"]);

        if (!id) {
          return false;
        }

        context.userId = id;

        return true;
      } else {
        throw new Error("Token is neccessary");
      }
    });
  }
}
