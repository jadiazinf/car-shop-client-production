import { Checkbox } from "@heroui/react";
import ServiceModel from "../../../../../../../entities/service/model";
import { VehicleType } from "../../../../../../../entities/vehicle/types";
import {
  ServiceOrderModel,
  ServiceOrderStatus,
} from "../../../../../../../entities/service_order/model";

interface IProps {
  services: ServiceModel[];
  vehicle_type: VehicleType;
  selectedServiceOrders: ServiceOrderModel[] | null;
  setSelectedServiceOrders: (services: ServiceOrderModel[]) => void;
}

export function ServiceInfoComponent(props: IProps) {
  function getServiceOrderFromService(service: ServiceModel) {
    return {
      cost: service[`price_for_${props.vehicle_type}`],
      status: ServiceOrderStatus.IN_PROGRESS,
      service_id: service.id!,
      service,
    } as ServiceOrderModel;
  }

  function handleSelection(service: ServiceModel) {
    const isServiceSelected =
      props.selectedServiceOrders?.some(
        (element) => element.service_id === service.id
      ) || false;
    if (isServiceSelected) {
      props.setSelectedServiceOrders(
        props.selectedServiceOrders!.filter(
          (service_order) => service_order.service_id !== service.id
        )
      );
      return;
    }

    props.setSelectedServiceOrders([
      ...(props.selectedServiceOrders || []),
      getServiceOrderFromService(service),
    ]);
  }

  return props.services.map((service) => (
    <div
      className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b-1.5 border-black border-opacity-50 py-2 cursor-pointer"
      key={service.id}
      onClick={() => handleSelection(service)}
    >
      <div className="flex h-full items-center gap-2 col-span-2">
        <Checkbox
          radius="sm"
          onValueChange={() => handleSelection(service)}
          isSelected={
            props.selectedServiceOrders?.some(
              (element) => element.service_id === service.id
            ) || false
          }
        />
        <div>
          <p>{service.name}</p>
          <p className="text-sm text-black text-opacity-50">
            {service.description}
          </p>
        </div>
      </div>
      <div className="h-full flex items-center">
        <p>{service.category!.name}</p>
      </div>
      <div className="h-full flex items-center gap-5">
        <p>{`${Number(service[`price_for_${props.vehicle_type}`]).toFixed(
          2
        )} REF`}</p>
        {/* <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Cambiar costo"
            type="button"
            variant="light"
          />
        </div> */}
      </div>
    </div>
  ));
}
