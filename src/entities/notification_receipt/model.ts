import { NotificationModel } from "../notification/model";
import UserModel from "../user/model";

export type NotificationReceiptModel = {
  id: number;
  user_id: number;
  user?: UserModel;
  notification_id: number;
  notification: NotificationModel;
};
