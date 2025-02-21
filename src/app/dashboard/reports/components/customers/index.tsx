import { ReportsProps } from "../type";
import { CapturedCustomersByServiceCategoryAndPeriodReport } from "./captured_customers_by_service_category_and_period";
import { CapturedCustomersPercentageByPeriod } from "./captured_customers_percentage_by_period";
import { CustomersServedByPeriod } from "./customers_served_by_period";

export function CustomersReports(props: ReportsProps) {
  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="col-span-1 lg:col-span-2">
        <CustomersServedByPeriod {...props} />
      </div>
      <div className="col-span-1 lg:col-span-2">
        <CapturedCustomersByServiceCategoryAndPeriodReport {...props} />
      </div>
      <div className="col-span-1 lg:col-span-4">
        <div className="w-full h-full flex justify-center items-center">
          <CapturedCustomersPercentageByPeriod {...props} />
        </div>
      </div>
    </div>
  );
}
