import { createServiceOrder } from "./create";
import { createServicesOrdersInBatch } from "./create_in_batch";
import { getServiceOrder } from "./get";
import { updateServiceOrder } from "./update";
import { updateServicesOrdersStatus } from "./update_services_orders_status";

export const useServiceOrderApiServices = {
  updateServiceOrder,
  updateServicesOrdersStatus,
  createServiceOrder,
  createServicesOrdersInBatch,
  getServiceOrder,
};
