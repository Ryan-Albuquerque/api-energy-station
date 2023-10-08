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
    startDate: Date
    endDate: Date
    totalTime: Float
  }

  type HistoryRecharge {
    recharges: [Recharge]
    totalTime: Float
  }

  type Mutation {
    recharge(recharge: RechargeInput): Recharge
  }

  type Query {
    listRecharges: [Recharge]
    rechargeStationHistory(stationName: String): HistoryRecharge
  }
`;
