import { gql } from "apollo-server";

export const StationGQL = gql`
  input StationInput {
    name: String!
    planetName: String!
  }
  type Station {
    _id: ID
    name: String
    planetName: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    stations: [Station]
  }

  type Mutation {
    installStation(station: StationInput): Station
    updateStation(id: ID, station: StationInput!): Station
  }
`;
