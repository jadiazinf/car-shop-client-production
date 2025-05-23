import { useContext, useEffect, useState } from "react";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { usePersistedStore } from "../../../../store/store";
import DatatableComponent from "../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../components/datatable/types";
import PaginationComponent from "../../../../components/datatable/pagination";
import DatesHelpers from "../../../../helpers/dates/helper";
import useDatatableAction from "../../../../components/datatable/use_action";
import { useOrderApiServices } from "../../../api/orders";
import { OrderStatus } from "../../../../entities/order/model";
import { UserCompanyRole } from "../../../../entities/users_companies/types";
import { Button, Input, Select, SelectItem } from "@heroui/react";

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
    text: "Servicios del taller",
    url: "/dashboard/services",
  },
  {
    text: "Cotizaciones",
    url: "/dashboard/services/quotes",
  },
];

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "client", label: "Cliente" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "vehicle", label: "Vehículo" },
  { key: "license_plate", label: "Placa" },
  { key: "total_cost", label: "Costo de la cotización" },
  { key: "actions", label: "Acciones" },
];

export default function ServicesQuotesPage() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { getCompanyQuotesResponse, isGettingQuotes, perform } =
    useOrderApiServices.getCompanyQuotes();

  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  const [filterState, setFilterState] = useState<
    OrderStatus.QUOTE | OrderStatus.ACTIVE_FOR_ORDER_CREATION | "All"
  >(OrderStatus.QUOTE);

  const [licensePlateFilter, setLicensePlateFilter] = useState<string>("");

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  useEffect(() => {
    let filters: any =
      filterState === "All"
        ? {
            company_id: sessionType!.company_id!,
            page,
          }
        : {
            company_id: sessionType!.company_id!,
            status: filterState,
            page,
          };
    if (licensePlateFilter.length > 0) {
      filters = {
        ...filters,
        license_plate: licensePlateFilter,
      };
    }

    perform(filters, token!);
  }, [page, filterState, licensePlateFilter]);

  useEffect(() => {
    if (datatableAction.action === "view") {
      const company_id = getCompanyQuotesResponse?.data?.data?.find(
        (order) => order.id === datatableAction.id
      )!.company_id;
      navigate(
        `/dashboard/services/quotes/${datatableAction.id}/${company_id}`
      );
    }
  }, [datatableAction]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2 md:flex-row md:gap-0 md: md:justify-between items-center mb-5">
        <p className="font-inter font-semibold text-2xl">Cotizaciones</p>
        <div className="flex flex-col gap-1 md:flex-row md:gap-5 justify-end items-center w-full">
          <div className="w-52">
            <Input
              size="md"
              variant="bordered"
              label="Buscar por placa"
              name="license_plate_filter"
              type="text"
              radius="sm"
              value={licensePlateFilter}
              onChange={(e) => setLicensePlateFilter(e.target.value)}
            />
          </div>
          <div className="w-80">
            <Select
              variant="bordered"
              disallowEmptySelection
              label="Estado de cotización"
              size="md"
              radius="sm"
              name="status"
              onChange={(e) =>
                setFilterState(
                  e.target.value as
                    | OrderStatus.QUOTE
                    | OrderStatus.ACTIVE_FOR_ORDER_CREATION
                )
              }
              value={filterState}
            >
              {[
                {
                  key: OrderStatus.QUOTE,
                  label: "Solicitudes por responder",
                },
                {
                  key: OrderStatus.ACTIVE_FOR_ORDER_CREATION,
                  label: "Solicitudes pendientes para crear orden de trabajo",
                },
                {
                  key: "All",
                  label: "Todas las solicitudes",
                },
              ].map(element => (<SelectItem key={element.key}>{element.label}</SelectItem>))}
            </Select>
          </div>
          {!sessionType!.roles!.includes(UserCompanyRole.TECHNICIAN) && (
            <div className="flex">
              <div className="w-auto">
                <Button
                  color="primary"
                  type="button"
                  variant="solid"
                  size="lg"
                  radius="sm"
                  startContent={<IoAdd className="w-5 h-5" />}
                  onPress={() => navigate("/dashboard/services/quotes/new")}
                >
                  Crear cotización
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <DatatableComponent
        columns={DATATABLE_COLUMNS}
        isLoading={isGettingQuotes}
        isRowDataViewable
        actionState={datatableAction}
        setActionState={setDatatableAction}
        onViewAction={(quoteId) =>
          navigate(`/dashboard/services/quotes/${quoteId}`)
        }
        data={
          getCompanyQuotesResponse?.data?.data?.map((quote) => ({
            id: quote.id!,
            client: `${quote.vehicle?.user?.first_name} ${quote.vehicle?.user?.last_name}`,
            created_at: DatesHelpers.formatFullDate(quote.created_at as string),
            vehicle: quote.vehicle!.model!.brand!.name,
            license_plate: quote.vehicle!.license_plate,
            total_cost: `${
              quote.services_orders
                ?.reduce((prev, curr) => prev + Number(curr.cost), 0)
                .toFixed(2) || 0.0
            } REF`,
          })) || []
        }
      />
      <div className="w-full flex justify-end mt-5">
        <PaginationComponent
          page={page}
          pages={getCompanyQuotesResponse?.data?.total_pages || 0}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
