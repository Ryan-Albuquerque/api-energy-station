import { RechargeEntity } from "../../recharges/entities/recharge.entity";
import { CreateOrUpdateReservationDto } from "../dtos/create-or-update-reservation.dto";
import { ReservationEntity } from "../reservation.entity";

export abstract class IReservationResolver {
  abstract Mutation: {
    reservation: (
      _: any,
      { reservation }: { reservation: CreateOrUpdateReservationDto }
    ) => Promise<Partial<ReservationEntity>>;
    // triggerReservation: (
    //   _: any,
    //   { id }: { id: string }
    // ) => Promise<RechargeEntity>;
    // updateReservation: (
    //   _: any,
    //   {
    //     id,
    //     reservation,
    //   }: { id: string; reservation: CreateOrUpdateReservationDto }
    // ) => Promise<Partial<ReservationEntity>>;
  };
  abstract Query: {
    listReservations: () => Promise<Partial<Partial<ReservationEntity>>[]>;
  };
}
