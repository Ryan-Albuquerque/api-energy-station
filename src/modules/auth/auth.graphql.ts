import { gql } from "apollo-server";

export const AuthGQL = gql`
  input AuthInput {
    password: String!
    email: String!
  }

  type AuthResult {
    token: String
  }

  type Mutation {
    login(data: AuthInput): AuthResult
  }
`;
