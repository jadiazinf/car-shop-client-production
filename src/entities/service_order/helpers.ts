import { ServiceOrderModel, ServiceOrderStatus } from "./model";

function translateServiceOrderStatus(service_order: ServiceOrderModel) {
  switch (service_order.status) {
    case ServiceOrderStatus.PENDING_FOR_QUOTE_APPROVEMENT:
      return "Pendiente de aprobación de cotización";
    case ServiceOrderStatus.CANCELED:
      return "Cancelado";
    case ServiceOrderStatus.FINISHED:
      return "Finalizado";
    case ServiceOrderStatus.IN_PROGRESS:
      return "En progreso";
  }
}

export const ServiceOrderHelpers = {
  translateServiceOrderStatus,
};
