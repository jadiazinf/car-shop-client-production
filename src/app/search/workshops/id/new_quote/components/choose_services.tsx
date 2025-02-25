import { Checkbox, Spinner } from "@heroui/react";
import {
  ServiceOrderModel,
  ServiceOrderStatus,
} from "../../../../../../entities/service_order/model";
import { VehicleType } from "../../../../../../entities/vehicle/types";
import { useCompanyApiServices } from "../../../../../api/companies";
import { useEffect, useState } from "react";
import ServiceModel from "../../../../../../entities/service/model";
import PaginationComponent from "../../../../../../components/datatable/pagination";

type Props = {
  company_id: number;
  vehicle_type: VehicleType;
  selectedServicesOrders: ServiceOrderModel[];
  setSelectedServicesOrders: (services_orders: ServiceOrderModel[]) => void;
};

export function ChooseServicesForQuote(props: Props) {
  const {
    getCompanyServicesByVehicleTypeResponse,
    isGettingCompanyServices,
    perform: getCompanyServicesByVehicleType,
  } = useCompanyApiServices.getCompanyServicesByVehicleType();

  const [page, setPage] = useState(1);

  useEffect(() => {
    getCompanyServicesByVehicleType(props.company_id, props.vehicle_type, page);
  }, [page]);

  function handleServiceOrderSelection(service: ServiceModel) {
    if (
      !props.selectedServicesOrders.some((s) => s.service_id === service.id)
    ) {
      props.setSelectedServicesOrders([
        ...props.selectedServicesOrders,
        {
          cost: Number(service[`price_for_${props.vehicle_type}`]) ?? 0,
          service_id: service.id,
          status: ServiceOrderStatus.PENDING_FOR_QUOTE_APPROVEMENT,
          service,
        },
      ]);
    } else
      props.setSelectedServicesOrders(
        props.selectedServicesOrders.filter((s) => s.service_id !== service.id)
      );
  }

  function getPriceForServiceByType(service: ServiceModel) {
    switch (props.vehicle_type) {
      case VehicleType.MOTORBIKE:
        return service.price_for_motorbike;
      case VehicleType.CAR:
        return service.price_for_car;
      case VehicleType.TRUCK:
        return service.price_for_truck;
      case VehicleType.VAN:
        return service.price_for_van;
    }
  }

  return (
    <div className="">
      {isGettingCompanyServices ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {getCompanyServicesByVehicleTypeResponse?.data?.data.map(
            (service) => (
              <div
                className={`${
                  props.selectedServicesOrders.some(
                    (s) => s.service_id === service.id
                  )
                    ? "border-primary"
                    : "border-black border-opacity-40"
                }  border-1.5 rounded-md p-2 w-full cursor-pointer flex gap-2 items-center`}
                key={service.id}
                onClick={() => handleServiceOrderSelection(service)}
              >
                <Checkbox
                  radius="sm"
                  isSelected={props.selectedServicesOrders.some(
                    (s) => s.service_id === service.id
                  )}
                  onClick={() => handleServiceOrderSelection(service)}
                />
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-semibold text-lg">
                      <p>{service.name}</p>
                    </div>
                    <p className="text-sm">{service.description}</p>
                  </div>
                  <div>{`${(
                    getPriceForServiceByType(service) as number
                  ).toFixed(2)} REF`}</div>
                </div>
              </div>
            )
          ) || []}
          <div className="mt-5 w-full flex justify-end">
            <PaginationComponent
              page={page}
              setPage={setPage}
              pages={
                getCompanyServicesByVehicleTypeResponse?.data?.total_pages || 0
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
