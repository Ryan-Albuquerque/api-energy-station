import { Rule } from "graphql-shield/typings/rules";

export abstract class IAuthenticationMiddleware {
  abstract auth(): Rule;
}
