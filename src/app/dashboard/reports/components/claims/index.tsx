import { ReportsProps } from "../type";
import { ClaimsByServiceCategoryReport } from "./claims_by_service_category";

export function ClaimsReportsComponent(props: ReportsProps) {
  return (
    <div className="w-full h-full grid grid-cols-1 gap-4">
      <ClaimsByServiceCategoryReport
        company_id={props.company_id}
        start_date={props.start_date}
        end_date={props.end_date}
        token={props.token}
      />
    </div>
  );
}
