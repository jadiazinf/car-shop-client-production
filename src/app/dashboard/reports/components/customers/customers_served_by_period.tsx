import { useEffect } from "react";
import { useReportsApiServices } from "../../../../api/reports";
import { ReportsProps } from "../type";
import { Spinner, Tooltip } from "@heroui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { transformCustomersServedData } from "./helpers/customers_served_by_period";

export function CustomersServedByPeriod({
  company_id,
  end_date,
  start_date,
  token,
}: ReportsProps) {
  const {
    customersServedByPeriodResponse,
    isGettingcustomersServedByPeriod,
    perform,
  } = useReportsApiServices.customersServedByPeriod();

  useEffect(() => {
    perform(company_id, start_date, end_date, token);
  }, [start_date, end_date]);

  return (
    <div className="flex-grow w-full h-[400px] min-h-[300px]">
      {isGettingcustomersServedByPeriod ? (
        <div className="p-5 flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <>
          <p className="font-medium mb-5">
            {/* Cantidad de órdenes con reclamo por categoria de servicios */}
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformCustomersServedData(
                customersServedByPeriodResponse?.data
                  ?.customers_served_by_period ?? {}
              )}
              margin={{ top: 5, right: 30, left: 80, bottom: 40 }}
              title="Cantidad de órdenes con reclamo por categoria de servicios"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tickFormatter={(value) => value} />
              <YAxis
                label={{
                  value: "Clientes servidos por periodo",
                  angle: -90,
                  position: "insideLeft",
                  dx: -20,
                  dy: 0,
                  style: { textAnchor: "middle", fontSize: 14 },
                }}
                domain={[0, "dataMax + 1"]}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#8884d8"
                barSize={50}
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
