import { useEffect } from "react";
import { useReportsApiServices } from "../../../../api/reports";
import { ReportsProps } from "../type";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spinner } from "@nextui-org/react";

type BarChartData = {
  name: string;
  Órdenes: number;
};

export function ClaimsByServiceCategoryReport({
  start_date,
  end_date,
  company_id,
  token,
}: ReportsProps) {
  const {
    claimsByServiceCategoryResponse,
    isGettingClaimsByServiceCategory,
    perform,
  } = useReportsApiServices.claimsByServiceCategory();

  useEffect(() => {
    perform(company_id, start_date, end_date, token);
  }, [start_date, end_date]);

  function transformData(): BarChartData[] {
    if (!claimsByServiceCategoryResponse?.data) return [];

    return Object.entries(
      claimsByServiceCategoryResponse.data.claims_by_service_category
    ).map(([category, value]) => ({
      name: category,
      Órdenes: value ?? 0,
    }));
  }

  return (
    <div className="flex-grow w-full h-[400px] min-h-[300px]">
      {isGettingClaimsByServiceCategory ? (
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
              data={transformData()}
              margin={{ top: 5, right: 30, left: 80, bottom: 40 }}
              title="Cantidad de órdenes con reclamo por categoria de servicios"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickFormatter={(value) => value} />
              <YAxis
                label={{
                  value: "# de órdenes con reclamo",
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
