import { OrderModel } from "../order/model";
import ServiceModel from "../service/model";

export enum ServiceOrderStatus {
  PENDING_FOR_QUOTE_APPROVEMENT = "pending_for_quote_approvement",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
  CANCELED = "canceled",
}

export type ServiceOrderModel = {
  id?: number;
  cost: number;
  status: ServiceOrderStatus;
  order_id?: number;
  order?: OrderModel;
  service_id?: number;
  service?: ServiceModel;
};
