import { NotificationModel } from "./model";
import { NotificationCategory } from "./types";

function getNotificationMessage(notification: NotificationModel) {
  console.log("La notificación es: ", notification);
  switch (notification.category) {
    case NotificationCategory.ADVANCE:
      return {
        message: `Tienes un nuevo avance en una orden de servicio. Click para ver la orden`,
        link: `/profile/orders/${notification.advance?.service_order?.order_id}/${notification.advance?.service_order?.order?.company_id}`,
      };
  }
}

export const NotificationHelpers = {
  getNotificationMessage,
};
