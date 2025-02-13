import CompanyModel from "../company/model";
import { ServiceOrderModel } from "../service_order/model";
import { UserCompanyModel } from "../users_companies/model";
import VehicleModel from "../vehicle/model";

export enum OrderStatus {
  QUOTE = "quote",
  ACTIVE_FOR_ORDER_CREATION = "active_for_order_creation",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
  CANCELED = "canceled",
}

export type OrderModel = {
  id?: number;
  status: OrderStatus;
  vehicle_mileage: number;
  is_active?: boolean;
  is_checked: boolean;
  created_by_id?: number | null;
  created_by?: UserCompanyModel;
  vehicle_id?: number;
  vehicle?: VehicleModel;
  company_id?: number;
  company?: CompanyModel;
  created_at?: string;
  updated_at?: string;
  services_orders?: ServiceOrderModel[];
  assigned_to_id?: number;
  assigned_to?: UserCompanyModel;
};
