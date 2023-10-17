export const reservation = `
      mutation Reservation($reservation: ReservationInput) {
        reservation(reservation: $reservation) {
          _id
          endDate
          startDate
          stationName
          userEmail
        }
      }
    `;

export const triggerReservation = `
  mutation TriggerReservation($triggerReservationId: ID!) {
    triggerReservation(id: $triggerReservationId) {
      _id
      endDate
      startDate
      stationName
      totalTime
      userEmail
    }
  }
`;

export const activeReservation = `
  query listActiveReservations {
    listActiveReservations {
      _id
      stationName
      userEmail
      startDate
      endDate
      isTrigged
    }
  }
`;
export const listReservations = `
  query listReservations {
    listReservations {
      _id
      stationName
      userEmail
      startDate
      endDate
      isTrigged
    }
  }
`;
