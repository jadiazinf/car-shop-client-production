import { useEffect } from "react";
import { useReportsApiServices } from "../../../../api/reports";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import { KpiContainer } from "./kpi_container";
import { ReportsProps } from "../type";

export function OrderWithoutClaimsKpiComponent({
  start_date,
  end_date,
  company_id,
  token,
}: ReportsProps) {
  const { isGettingOrdersWithoutClaims, ordersWithoutClaimsResponse, perform } =
    useReportsApiServices.ordersWithoutClaims();

  useEffect(() => {
    perform(company_id, start_date, end_date, token);
  }, [start_date, end_date]);

  return (
    <Card className="p-5" radius="sm">
      <CardBody className="w-full h-full flex justify-center items-center">
        {isGettingOrdersWithoutClaims ? (
          <Spinner />
        ) : (
          <KpiContainer
            name="Órdenes sin reclamos"
            value={`${
              ordersWithoutClaimsResponse?.data?.orders_without_claims ?? "0"
            } órdenes`}
          />
        )}
      </CardBody>
    </Card>
  );
}
