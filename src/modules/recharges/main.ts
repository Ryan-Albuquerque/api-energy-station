import { RechargeRepository } from "./repository/recharge.repository";
import { RechargeService } from "./services/recharge.service";
import { RechargeResolver } from "./resolvers/recharge.resolver";
import { userModule } from "./../users/main";
import { stationModule } from "./../stations/main";
import { ReservationModel } from "./../reservation/model/reservation.model";
import { RechargeModel } from "./model/recharge.model";
// import { RechargeAgendaService } from "../services/agenda/recharge.agenda.service";

function rechargeFactory() {
  const rechargeRepository = new RechargeRepository(
    RechargeModel,
    ReservationModel
  );

  //   const rechargeAgendaService = new RechargeAgendaService(
  //     rechargeRepository
  //   );

  const rechargeService = new RechargeService(
    rechargeRepository,
    userModule.userService,
    stationModule.stationService
  );

  const { Query, Mutation } = new RechargeResolver(rechargeService);

  return { Query, Mutation, rechargeService };
}

export const rechargeModule = rechargeFactory();
