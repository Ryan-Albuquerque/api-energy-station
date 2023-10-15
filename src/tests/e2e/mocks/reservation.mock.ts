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

// export const reservationsQuery = `
//   query Reservations {
//     reservations {
//       _id
//       createdAt
//       name
//       planetName
//       updatedAt
//     }
//   }
// `;
