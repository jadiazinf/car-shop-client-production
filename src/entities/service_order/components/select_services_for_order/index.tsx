import { useEffect, useState } from "react";
import { useCompanyApiServices } from "../../../../app/api/companies";
import { VehicleType } from "../../../vehicle/types";
import { Spinner } from "@nextui-org/react";
import PaginationComponent from "../../../../components/datatable/pagination";
import { NewServiceOrderComponent } from "../../new";
import { ServiceOrderModel, ServiceOrderStatus } from "../../model";

type Props = {
  company_id: number;
  vehicle_type: VehicleType;
  serviceOrderStatus: ServiceOrderStatus;
  selectedServicesOrder: ServiceOrderModel[];
  onSelectedServicesOrder: (services: ServiceOrderModel[]) => void;
};

export function SelectServicesForOrders(props: Props) {
  const { getCompanyServicesResponse, isGettingCompanyServices, perform } =
    useCompanyApiServices.getCompanyServices();

  const [page, setPage] = useState(1);

  useEffect(() => {
    perform(props.company_id, page);
  }, [page]);

  function getServicesByVehicleType() {
    if (!getCompanyServicesResponse?.data?.data) return [];

    const services = getCompanyServicesResponse.data.data.filter((service) => {
      if (
        props.vehicle_type === VehicleType.MOTORBIKE &&
        service.price_for_motorbike
      )
        return true;
      if (props.vehicle_type === VehicleType.CAR && service.price_for_car)
        return true;
      if (props.vehicle_type === VehicleType.VAN && service.price_for_van)
        return true;
    });

    return services;
  }

  function handleServiceSelection(service: ServiceOrderModel) {
    const newServices = [...props.selectedServicesOrder];
    if (newServices.includes(service)) {
      newServices.filter((s) => s.id !== service.id);
    } else {
      newServices.push(service);
    }
    props.onSelectedServicesOrder(newServices);
  }

  return (
    <div className="w-full h-full">
      {isGettingCompanyServices ? (
        <Spinner />
      ) : !getCompanyServicesResponse ||
        !getCompanyServicesResponse.data ||
        !getCompanyServicesResponse.data.data ? (
        <p>No hay servicios disponibles</p>
      ) : (
        <div className="w-full h-full flex flex-col gap-3">
          {getServicesByVehicleType().map((service) => (
            <NewServiceOrderComponent
              handleServiceOrderSelection={handleServiceSelection}
              included={props.selectedServicesOrder.some(
                (s) => s.service_id === service.id
              )}
              service={service}
              status={props.serviceOrderStatus}
              vehicleType={props.vehicle_type}
              key={service.id}
            />
          ))}
          <PaginationComponent
            page={page}
            pages={getCompanyServicesResponse.data.total_pages}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
}
