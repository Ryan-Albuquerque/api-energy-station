import { gql } from "apollo-server";

export const UserGQL = gql`
  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  type User {
    _id: ID
    name: String
    email: String
    createdAt: String
    updatedAt: String
  }

  type Mutation {
    createUser(user: UserInput!): User!
    updateUser(id: ID!, user: UserInput!): User!
  }

  type Query {
    getUserByEmail(email: String!): User!
  }
`;
