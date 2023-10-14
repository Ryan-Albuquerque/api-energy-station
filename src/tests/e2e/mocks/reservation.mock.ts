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
