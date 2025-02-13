import { useContext, useEffect, useState } from "react";
import { DatatableColumnsProps } from "../../../components/datatable/types";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import { usePersistedStore } from "../../../store/store";
import useDatatableAction from "../../../components/datatable/use_action";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import { useOrderApiServices } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import { OrderStatus } from "../../../entities/order/model";
import SelectComponent from "../../../components/inputs/select";
import DatatableComponent from "../../../components/datatable/component";
import DatesHelpers from "../../../helpers/dates/helper";
import PaginationComponent from "../../../components/datatable/pagination";
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
    text: "Órdenes de servicion",
    url: "/profile/orders",
  },
];

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "client", label: "Cliente" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "vehicle", label: "Vehículo" },
  { key: "total_cost", label: "Costo de la orden de servicio" },
  { key: "actions", label: "Acciones" },
];

export function UserOrdersPage() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { getUserOrdersResponse, isGettingOrders, perform } =
    useOrderApiServices.getUserOrders();

  const { perform: getAllUserVehicles, userVehiclesResponse } =
    useUsersApiServices.getAllUserVehicles();

  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  const [filterState, setFilterState] = useState<
    OrderStatus.CANCELED | OrderStatus.FINISHED | OrderStatus.IN_PROGRESS
  >(OrderStatus.IN_PROGRESS);

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
    getAllUserVehicles(token!);
  }, []);

  useEffect(() => {
    perform(
      selectedVehicle !== null
        ? {
            status: filterState,
            user_id: sessionType!.user!.id!,
            page,
            vehicle_id: selectedVehicle,
          }
        : { status: filterState, user_id: sessionType!.user!.id!, page },
      token!
    );
  }, [page, filterState, selectedVehicle]);

  useEffect(() => {
    if (datatableAction.action === "view") {
      const company_id = getUserOrdersResponse?.data?.data?.find(
        (order) => order.id === datatableAction.id
      )?.company_id!;
      navigate(`/profile/orders/${datatableAction.id}/${company_id}`);
    }
  }, [datatableAction]);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2 md:flex-row md:gap-0 md: md:justify-between items-center mb-5">
        <p className="font-inter font-semibold text-2xl w-full">
          Órdenes de servicios
        </p>
        <div className="flex flex-col gap-1 md:flex-row md:gap-5 justify-end items-center w-full">
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
            <div className="w-80">
              <SelectComponent
                label="Estado de la orden de servicio"
                variant="bordered"
                data={[
                  {
                    key: OrderStatus.IN_PROGRESS,
                    label: "En progreso",
                  },
                  {
                    key: OrderStatus.FINISHED,
                    label: "Terminadas",
                  },
                  {
                    key: OrderStatus.CANCELED,
                    label: "Canceladas",
                  },
                ]}
                name="status"
                onChange={(e) =>
                  setFilterState(
                    e.target.value as
                      | OrderStatus.CANCELED
                      | OrderStatus.FINISHED
                      | OrderStatus.IN_PROGRESS
                  )
                }
                value={filterState}
              />
            </div>
          </div>
        </div>
      </div>
      <DatatableComponent
        columns={DATATABLE_COLUMNS}
        isLoading={isGettingOrders}
        isRowDataViewable
        actionState={datatableAction}
        setActionState={setDatatableAction}
        data={
          getUserOrdersResponse?.data?.data?.map((order) => ({
            id: order.id!,
            client: `${order.vehicle?.user?.first_name} ${order.vehicle?.user?.last_name}`,
            created_at: DatesHelpers.formatFullDate(order.created_at as string),
            vehicle: order.vehicle!.model!.brand!.name,
            total_cost: `${
              order.services_orders
                ?.reduce((prev, curr) => prev + Number(curr.cost), 0)
                .toFixed(2) || 0.0
            } REF`,
          })) || []
        }
      />
      <div className="w-full flex justify-end mt-5">
        <PaginationComponent
          page={page}
          pages={getUserOrdersResponse?.data?.total_pages || 0}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
