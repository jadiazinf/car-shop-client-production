import ServiceModel from "../service/model";
import VehicleModel from "../vehicle/model";

export enum QuoteStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export type QuoteModel = {
  id?: number;
  group_id?: string;
  date: string | Date;
  note?: string;
  total_cost: number;
  status_by_company: QuoteStatus;
  status_by_client: QuoteStatus;
  vehicle_id: number;
  vehicle?: VehicleModel;
  service_id: number;
  service?: ServiceModel;
  created_at: string;
  updated_at: string;
};
