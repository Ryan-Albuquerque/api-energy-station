import { gql } from "apollo-server";

export const ReservationGQL = gql`
  scalar Date

  input ReservationInput {
    stationName: String!
    userEmail: String!
    startDate: Date!
    endDate: Date!
  }

  type Reservation {
    _id: ID
    stationName: String
    userEmail: String
    startDate: Date
    endDate: Date
    isTrigged: Boolean
  }

  type Recharge {
    _id: ID
    stationName: String
    userEmail: String
    startDate: Date
    endDate: Date
    totalTime: Float
  }

  type Query {
    listReservations: [Reservation]!
    listActiveReservations: [Reservation]!
  }

  type Mutation {
    reservation(reservation: ReservationInput): Reservation!
    triggerReservation(id: ID!): Recharge!
    updateReservation(id: ID!, reservation: ReservationInput!): Reservation!
  }
`;
