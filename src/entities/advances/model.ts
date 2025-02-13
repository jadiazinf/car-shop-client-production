import { ServiceOrderModel } from "../service_order/model";

export type AdvanceModel = {
  id?: number;
  description: string;
  advance_images?: File[] | string[];
  service_order_id?: number;
  service_order?: ServiceOrderModel;
};
