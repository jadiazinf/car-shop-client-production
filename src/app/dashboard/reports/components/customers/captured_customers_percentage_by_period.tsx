import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useReportsApiServices } from "../../../../api/reports/index";
import { Spinner } from "@heroui/react";
import { ReportsProps } from "../type";

const COLORS = ["#4F46E5", "#FACC15"];

export function CapturedCustomersPercentageByPeriod({
  company_id,
  start_date,
  end_date,
  token,
}: ReportsProps) {
  const {
    perform,
    capturedCustomersPercentageByPeriodResponse,
    isGettingCapturedCustomersPercentageByPeriod,
  } = useReportsApiServices.capturedCustomersPercentageByPeriod();

  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    perform(company_id, start_date, end_date, token);
  }, [start_date, end_date, token]);

  useEffect(() => {
    if (
      capturedCustomersPercentageByPeriodResponse &&
      capturedCustomersPercentageByPeriodResponse.data
    ) {
      const { total_orders, captured_orders, captured_customers_percentage } =
        capturedCustomersPercentageByPeriodResponse.data
          .captured_customers_percentage_by_period;
      if (total_orders !== null && captured_orders !== null) {
        setData([
          { name: "Total de clientes Atendidos", value: total_orders },
          { name: "Total de clientes captados", value: captured_orders },
        ]);
      }
      setPercentage(captured_customers_percentage || 0);
    }
  }, [capturedCustomersPercentageByPeriodResponse]);

  return isGettingCapturedCustomersPercentageByPeriod ? (
    <div className="w-full h-full flex justify-center items-center p-5">
      <Spinner />
    </div>
  ) : data.length === 0 ? null : (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold text-gray-900"
          >
            {percentage}%
          </motion.div>
          <div className="text-sm text-gray-500">Captación de clientes</div>
        </div>
      </motion.div>
      <div className="flex justify-center mt-4 space-x-4">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-blue-600 inline-block rounded-full mr-2"></span>
          <span className="text-gray-700 text-sm">Clientes Atendidos</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-yellow-400 inline-block rounded-full mr-2"></span>
          <span className="text-gray-700 text-sm">Clientes Captados</span>
        </div>
      </div>
    </div>
  );
}
