import { AdvanceModel } from "../advances/model";
import { NotificationReceiptModel } from "../notification_receipt/model";
import { NotificationCategory } from "./types";

export type NotificationModel = {
  id: number;
  category: NotificationCategory;
  notifications_receipts?: NotificationReceiptModel[];
  notifications_receipts_id?: number[];
  advance_id: number | null;
  advance?: AdvanceModel | null;
};
