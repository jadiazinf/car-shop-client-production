import { capturedCustomersByServiceCategoryAndPeriod } from "./captured_customers_by_service_category_and_period";
import { capturedCustomersPercentageByPeriod } from "./captured_customers_percentage_by_period";
import { claimsByPeriod } from "./claims_by_period";
import { claimsByServiceCategory } from "./claims_by_service_category";
import { customersServedByPeriod } from "./customers_served_by_period";
import { ordersWithClaims } from "./orders_with_claims";
import { ordersWithoutClaims } from "./orders_without_claims";

export const useReportsApiServices = {
  ordersWithClaims,
  ordersWithoutClaims,
  claimsByServiceCategory,
  claimsByPeriod,
  customersServedByPeriod,
  capturedCustomersPercentageByPeriod,
  capturedCustomersByServiceCategoryAndPeriod,
};
