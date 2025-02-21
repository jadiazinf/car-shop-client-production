import { ReportsProps } from "../type";
import { OrdersWithClaimsKpiComponent } from "./orders_with_claims";
import { OrderWithoutClaimsKpiComponent } from "./orders_without_claims";

export function KpiReportsComponent(props: ReportsProps) {
  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <OrdersWithClaimsKpiComponent
        start_date={props.start_date}
        end_date={props.end_date}
        company_id={props.company_id}
        token={props.token}
      />
      <OrderWithoutClaimsKpiComponent
        start_date={props.start_date}
        end_date={props.end_date}
        company_id={props.company_id}
        token={props.token}
      />
    </div>
  );
}
