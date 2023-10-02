import { ReservationModel } from "./model/reservation.model";
import { ReservationService } from "./services/reservation.service";
import { ReservationResolver } from "./resolvers/reservation.resolver";
import { rechargeModule } from "./../recharges/main";
import { ReservationRepository } from "./repository/reservation.repository";

const main = () => {
  const repository = new ReservationRepository(ReservationModel);
  const reservationService = new ReservationService(
    repository,
    rechargeModule.rechargeService
  );
  const { Query, Mutation } = new ReservationResolver(reservationService);

  return { Query, Mutation, repository, reservationService };
};

export const reservationModule = main();
