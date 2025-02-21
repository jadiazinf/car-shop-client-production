import { useEffect } from "react";
import { useReportsApiServices } from "../../../../api/reports";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import { KpiContainer } from "./kpi_container";
import { ReportsProps } from "../type";

export function OrdersWithClaimsKpiComponent({
  start_date,
  end_date,
  company_id,
  token,
}: ReportsProps) {
  const { isGettingOrdersWithClaims, ordersWithClaimsResponse, perform } =
    useReportsApiServices.ordersWithClaims();

  useEffect(() => {
    perform(company_id, start_date, end_date, token);
  }, [start_date, end_date]);

  return (
    <Card className="p-5" radius="sm">
      <CardBody className="w-full h-full flex justify-center items-center">
        {isGettingOrdersWithClaims ? (
          <Spinner />
        ) : (
          <KpiContainer
            name="Órdenes con reclamos"
            value={`${
              ordersWithClaimsResponse?.data?.orders_with_claims ?? "0"
            } órdenes`}
          />
        )}
      </CardBody>
    </Card>
  );
}
