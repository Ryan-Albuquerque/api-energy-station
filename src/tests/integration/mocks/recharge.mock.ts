export const recharge = `
      mutation Recharge($recharge: RechargeInput) {
        recharge(recharge: $recharge) {
          _id
          endDate
          startDate
          stationName
          userEmail
          totalTime
        }
      }
    `;

export const listHistoryFromAStation = `
      query RechargeStationHistory($stationName: String) {
        rechargeStationHistory(stationName: $stationName) {
          recharges {
            _id
            stationName
            userEmail
            startDate
            endDate
            totalTime
          }
          totalTime
        }
      }
    `;
