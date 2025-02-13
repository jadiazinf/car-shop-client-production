import { useContext, useEffect, useState } from "react";
import { usePersistedStore } from "../../../store/store";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import DatatableComponent from "../../../components/datatable/component";
import useDatatableAction from "../../../components/datatable/use_action";
import { useNavigate } from "react-router-dom";
import DatesHelpers from "../../../helpers/dates/helper";
import PaginationComponent from "../../../components/datatable/pagination";
import { DatatableColumnsProps } from "../../../components/datatable/types";
import { useOrderApiServices } from "../../api/orders";
import SelectComponent from "../../../components/inputs/select";
import { OrderStatus } from "../../../entities/order/model";
import { useUsersApiServices } from "../../api/users";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Perfil",
    url: "/profile",
  },
  {
    text: "Cotizaciones",
    url: "/profile/quotes",
  },
];

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "company", label: "Compañía" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "vehicle", label: "Vehículo" },
  { key: "total_cost", label: "Costo de la cotización" },
  { key: "actions", label: "Acciones" },
];

export default function UserQuotesPage() {
  const { token, sessionType } = usePersistedStore().authReducer;

  const [page, setPage] = useState(1);

  const { getUserQuotesResponse, isGettingQuotes, perform } =
    useOrderApiServices.getUserQuotes();

  const { perform: getAllUserVehicles, userVehiclesResponse } =
    useUsersApiServices.getAllUserVehicles();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const navigate = useNavigate();

  const [filterState, setFilterState] = useState<
    OrderStatus.QUOTE | OrderStatus.ACTIVE_FOR_ORDER_CREATION | "All"
  >(OrderStatus.QUOTE);

  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
    getAllUserVehicles(token!);
  }, []);

  useEffect(() => {
    let filters: {
      page: number;
      user_id: number;
      status?: OrderStatus.QUOTE | OrderStatus.ACTIVE_FOR_ORDER_CREATION;
      vehicle_id?: number;
    } =
      filterState === "All"
        ? { page, user_id: sessionType!.user.id! }
        : { status: filterState, page, user_id: sessionType!.user.id! };

    if (selectedVehicle) filters = { ...filters, vehicle_id: selectedVehicle };

    perform(filters, token!);
  }, [page, filterState, selectedVehicle]);

  useEffect(() => {
    if (datatableAction.action === "view") {
      const company_id = getUserQuotesResponse?.data?.data?.find(
        (order) => order.id === datatableAction.id
      )?.company_id!;
      navigate(`/profile/quotes/${datatableAction.id}/${company_id}`);
    }
  }, [datatableAction]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2 md:flex-row md:gap-0 md: md:justify-between items-center mb-5">
        <p className="font-inter font-semibold text-2xl">Cotizaciones</p>
        <div className="flex flex-col gap-2 md:flex-row md:gap-5 justify-end items-center w-full">
          <div className="w-52">
            <SelectComponent
              label="Vehículo"
              disallowEmptySelection
              variant="bordered"
              data={
                userVehiclesResponse?.data?.map((vehicle) => ({
                  key: vehicle.id!.toString(),
                  label: `${vehicle.model?.brand?.name} ${vehicle.model?.name} ${vehicle.year}`,
                })) || []
              }
              name="vehicle_id"
              onChange={(e) =>
                setSelectedVehicle(parseInt(e.target.value) || null)
              }
              value={selectedVehicle?.toString() || ""}
            />
          </div>
          <div className="w-64">
            <SelectComponent
              disallowEmptySelection
              label="Estado de la cotización"
              variant="bordered"
              data={[
                {
                  key: OrderStatus.QUOTE,
                  label: "Solicitudes por responder",
                },
                {
                  key: OrderStatus.ACTIVE_FOR_ORDER_CREATION,
                  label:
                    "Solicitudes pendientes para creación de orden de servicio",
                },
                {
                  key: "All",
                  label: "Todas las solicitudes",
                },
              ]}
              name="status"
              onChange={(e) =>
                setFilterState(
                  e.target.value as
                    | OrderStatus.QUOTE
                    | OrderStatus.ACTIVE_FOR_ORDER_CREATION
                )
              }
              value={filterState}
            />
          </div>
        </div>
      </div>
      <DatatableComponent
        columns={DATATABLE_COLUMNS}
        isLoading={isGettingQuotes}
        isRowDataViewable
        actionState={datatableAction}
        setActionState={setDatatableAction}
        data={
          getUserQuotesResponse?.data?.data?.map((quote) => ({
            id: quote.id!,
            company: `${quote.company?.name || "Companía xs"}`,
            created_at: DatesHelpers.formatFullDate(quote.created_at as string),
            vehicle: quote.vehicle!.model!.brand!.name,
            total_cost: `${
              quote.services_orders
                ?.reduce((prev, curr) => prev + Number(curr.cost), 0)
                .toFixed(2) || "0.00"
            } REF`,
          })) || []
        }
      />
      <div className="w-full flex justify-end mt-5">
        <PaginationComponent
          page={page}
          pages={getUserQuotesResponse?.data?.total_pages || 0}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
