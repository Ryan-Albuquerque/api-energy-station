import { gql } from "apollo-server";

export const PlanetGQL = gql`
  type Planet {
    name: String
    mass: Float
    hasStation: Boolean
  }

  type Query {
    suitablePlanets: [Planet]
  }
`;
