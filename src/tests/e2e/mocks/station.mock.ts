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
