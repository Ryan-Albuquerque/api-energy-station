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
