import { OrderModel, OrderStatus } from "./model";

function translateOrderStatus(order: OrderModel) {
  switch (order.status) {
    case OrderStatus.QUOTE:
      return "Fase de cotización";
    case OrderStatus.IN_PROGRESS:
      return "En progreso";
    case OrderStatus.FINISHED:
      return "Finalizada";
    case OrderStatus.CANCELED:
      return "Cancelada";
    case OrderStatus.ACTIVE_FOR_ORDER_CREATION:
      return "Activa para creación de orden de servicio";
  }
}

export const OrdersHelpers = {
  translateOrderStatus,
};
