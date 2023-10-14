export const installStationMutation = `
      mutation InstallStation($station: StationInput) {
        installStation(station: $station) {
          _id
          createdAt
          updatedAt
          name
          planetName
        }
      }
    `;

// export const stationsQuery = `
//   query Stations {
//     stations {
//       _id
//       createdAt
//       name
//       planetName
//       updatedAt
//     }
//   }
// `;

export const variables = {
  station: {
    planetName: "HD 110014 b",
    name: "Nebula",
  },
};
