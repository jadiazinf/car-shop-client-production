import { OrderModel } from "../order/model";

export type UserOrderReviewModel = {
  id?: number;
  message: string;
  rating: number;
  order_id?: number;
  order?: OrderModel;
  created_at?: string;
  updated_at?: string;
};
