import { RechargeEntity } from "../../recharges/entities/recharge.entity";
import { CreateOrUpdateReservationDto } from "../dtos/create-or-update-reservation.dto";
import { IReservationService } from "../services/reservation.service.interface";
import { IReservationResolver } from "./reservation.resolver.interface";

export class ReservationResolver implements IReservationResolver {
  constructor(private readonly reservationService: IReservationService) {}

  Mutation = {
    reservation: async (
      _: any,
      { reservation }: { reservation: CreateOrUpdateReservationDto }
    ) => {
      const request = new CreateOrUpdateReservationDto(reservation);

      return await this.reservationService.createReservation(request);
    },
    // triggerReservation: async (
    //   _: any,
    //   { id }: { id: string }
    // ): Promise<RechargeEntity> => {
    //   return await this.reservationService.createRechargeByReservation(id);
    // },

    // updateReservation: async (
    //   _: any,
    //   {
    //     id,
    //     reservation,
    //   }: { id: string; reservation: CreateOrUpdateReservationDto }
    // ) => {
    //   const request = new CreateOrUpdateReservationDto(reservation);

    //   return await this.reservationService.update(id, request);
    // },
  };
  Query = {
    listReservations: async () => {
      return await this.reservationService.list();
    },
  };
}
