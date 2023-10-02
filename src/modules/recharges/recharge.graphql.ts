import { gql } from "apollo-server";

export const RechargeGQL = gql`
  scalar Date

  input RechargeInput {
    stationName: String!
    userEmail: String!
    endDate: Date!
  }

  type Recharge {
    _id: ID
    stationName: String
    userEmail: String
    inProgress: Boolean
    startDate: Date
    endDate: Date
    totalTime: String
  }

  type Mutation {
    recharge(recharge: RechargeInput): Recharge
  }

  type Query {
    listRecharges: [Recharge]
    stationHistory(stationName: String): [Recharge]
  }
`;
