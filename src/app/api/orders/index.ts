import { addAssignedTo } from "./add_assigned_to";
import { createOrder } from "./create";
import { getOrder } from "./get";
import { getOrdersByAssignedTo } from "./get_by_assigned_to";
import { getCompanyOrders } from "./get_company_orders";
import { getCompanyQuotes } from "./get_company_quotes";
import { getUserOrders } from "./get_user_orders";
import { getUserQuotes } from "./get_user_quotes";
import { updateOrder } from "./update";

export const useOrderApiServices = {
  getUserOrders,
  getUserQuotes,
  getCompanyOrders,
  getCompanyQuotes,
  createOrder,
  updateOrder,
  getOrder,
  addAssignedTo,
  getOrdersByAssignedTo,
};
