import { useContext, useEffect, useState } from "react";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import { Tab, Tabs } from "@nextui-org/react";
import { KpiReportsComponent } from "./components/kpi";
import { usePersistedStore } from "../../../store/store";
import { ClaimsReportsComponent } from "./components/claims";
import { CustomersReports } from "./components/customers";
import { DateRangePicker } from "../../../helpers/dates/components/date_picker";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Dashboard",
    url: "/dashboard",
  },
  {
    text: "Reportes",
    url: "/dashboard/reports",
  },
];

type Reports = "kpi" | "claims" | "customers";

export default function ReportsPage() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [selected, setSelected] = useState<Reports>("kpi");

  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const startDate = new Date(year, month, 1);

  const endDate = new Date(year, month + 1, 0);

  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate,
    endDate,
  });

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex justify-between">
        <div className="w-full flex flex-col">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            className="w-full"
            onSelectionChange={(value) => setSelected(value as Reports)}
            variant="underlined"
          >
            <Tab key="kpi" title="KPI">
              <KpiReportsComponent
                start_date={dateRange?.startDate.toString() ?? null}
                end_date={dateRange?.endDate.toString() ?? null}
                company_id={sessionType!.company_id!}
                token={token!}
              />
            </Tab>
            <Tab key="claims" title="Detalle de reclamos">
              <ClaimsReportsComponent
                start_date={dateRange?.startDate.toString() ?? null}
                end_date={dateRange?.endDate.toString() ?? null}
                company_id={sessionType!.company_id!}
                token={token!}
              />
            </Tab>
            <Tab key="customers" title="Detalle por clientes">
              <CustomersReports
                start_date={dateRange?.startDate.toString() ?? null}
                end_date={dateRange?.endDate.toString() ?? null}
                company_id={sessionType!.company_id!}
                token={token!}
              />
            </Tab>
          </Tabs>
        </div>
        <div>
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={(dateRange: {
              startDate: Date | null;
              endDate: Date | null;
            }) => setDateRange(dateRange as { startDate: Date; endDate: Date })}
          />
        </div>
      </div>
    </div>
  );
}
