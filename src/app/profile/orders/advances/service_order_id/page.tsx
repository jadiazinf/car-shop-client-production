import { useParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { StatusCodes } from "http-status-codes";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import { usePersistedStore } from "../../../../../store/store";
import { useContext, useEffect } from "react";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import { useAdvanceApiServices } from "../../../../api/advances";
import { useServiceOrderApiServices } from "../../../../api/services_orders";
import { useVehicleApiServices } from "../../../../api/vehicles";
import VehicleModel from "../../../../../entities/vehicle/model";
import { AdvanceModel } from "../../../../../entities/advances/model";

const HEADER_BREADCRUMBS = (
  order_id: number,
  company_id: number
): HeaderBreadcrumbItemProps[] => {
  return [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "Perfil",
      url: "/profile",
    },
    {
      text: "Órdenes de servicios",
      url: "/profile/orders",
    },
    {
      text: "Información de orden de servicio",
      url: `/profile/orders/${order_id}/${company_id}`,
    },
    {
      text: "Avances",
      url: "/profile/orders/advances/:service_order_id",
    },
  ];
};
export function UserServiceOrderAdvance() {
  const { token } = usePersistedStore().authReducer;

  const { service_order_id, order_id, company_id } = useParams();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { getServiceOrderAdvancesResponse, isGettingAdvances, perform } =
    useAdvanceApiServices.getServiceOrderAdvances();

  const {
    getServiceOrderResponse,
    isGettingServiceOrder,
    perform: getServiceOrder,
  } = useServiceOrderApiServices.getServiceOrder();

  const { getVehicleResponse, perform: getVehicle } =
    useVehicleApiServices.getVehicle();

  useEffect(() => {
    setBreadcrumbs(
      HEADER_BREADCRUMBS(parseInt(order_id!), parseInt(company_id!))
    );
    perform(parseInt(service_order_id!), parseInt(company_id!), token!);
    getServiceOrder(parseInt(service_order_id!), parseInt(company_id!), token!);
  }, []);

  useEffect(() => {
    if (getServiceOrderResponse?.status === StatusCodes.OK) {
      getVehicle(getServiceOrderResponse!.data!.order!.vehicle_id!, token!);
    }
  }, [getServiceOrderResponse]);

  return (
    <div className="w-full h-full">
      <div>
        <p className="font-semibold text-lg mb-2">Información del servicio</p>
        {isGettingServiceOrder ? (
          <Spinner />
        ) : (
          <div className="w-full flex flex-col gap-2 ">
            <p>{`Servicio: ${
              getServiceOrderResponse?.data?.service?.name || ""
            }`}</p>
            {!getVehicleResponse || !getVehicleResponse.data ? null : (
              <div className="flex gap-2">
                <p>
                  {(getVehicleResponse.data as VehicleModel).model!.brand!
                    .name +
                    " " +
                    (getVehicleResponse.data as VehicleModel).model!.name +
                    " (" +
                    (getVehicleResponse.data as VehicleModel).license_plate +
                    ") " +
                    (getVehicleResponse.data as VehicleModel).color ||
                    "Sin vehiculo"}
                </p>
              </div>
            )}
          </div>
        )}
        <p className="text-2xl font-bold my-5">
          Avances de la orden de servicio
        </p>
      </div>
      {isGettingAdvances ? (
        <Spinner />
      ) : !getServiceOrderAdvancesResponse ||
        !getServiceOrderAdvancesResponse.data ? null : !getServiceOrderAdvancesResponse.data ||
        (getServiceOrderAdvancesResponse.data as AdvanceModel[])?.length ===
          0 ? (
        <p>No hay avances para esta orden de servicio</p>
      ) : (
        <div>
          {(getServiceOrderAdvancesResponse.data as AdvanceModel[]).map(
            (advance) => (
              <div
                className="w-full h-full flex flex-col gap-2 mb-5"
                key={advance.id}
              >
                <p className="font-semibold">{advance.description}</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                  {(advance.advance_images as string[])?.map(
                    (image: string, index: number) => (
                      <img
                        key={`${advance.id}-${index}`}
                        className="h-full m-auto"
                        src={`${
                          import.meta.env.VITE_API_BASE_ROUTE + "/"
                        }${image}`}
                      />
                    )
                  ) || <p>No hay imágenes</p>}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
