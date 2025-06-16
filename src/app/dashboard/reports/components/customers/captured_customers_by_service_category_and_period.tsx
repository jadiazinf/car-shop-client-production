import { useEffect } from "react";
import { ReportsProps } from "../type";
import { useReportsApiServices } from "../../../../api/reports";
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

type BarChartData = {
  name: string;
  Órdenes: number;
};

export function CapturedCustomersByServiceCategoryAndPeriodReport({
  company_id,
  end_date,
  start_date,
  token,
}: ReportsProps) {
  const {
    capturedCustomersByServiceCategoryAndPeriodResponse,
    isGettingCapturedCustomersByServiceCategoryAndPeriod,
    perform,
  } = useReportsApiServices.capturedCustomersByServiceCategoryAndPeriod();

  useEffect(() => {
    perform(company_id, start_date, end_date, token);
  }, [start_date, end_date]);

  function transformData(): BarChartData[] {
    if (!capturedCustomersByServiceCategoryAndPeriodResponse?.data) return [];

    return Object.entries(
      capturedCustomersByServiceCategoryAndPeriodResponse.data
        .captured_customers_by_service_category_and_period
    ).map(([category, value]) => ({
      name: category,
      Órdenes: value ?? 0,
    }));
  }

  return (
    <div className="flex-grow w-full h-[400px] min-h-[300px]">
      {isGettingCapturedCustomersByServiceCategoryAndPeriod ? (
        <div className="p-5 flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <>
          <p className="font-medium mb-5"></p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformData()}
              margin={{ top: 5, right: 30, left: 80, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickFormatter={(value) => value} />
              <YAxis
                label={{
                  value: "Cantidad de clientes servidos por categoría",
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
                dataKey="Órdenes"
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
