import { useEffect, useState } from "react";
import { Divider, Spinner } from "@nextui-org/react";
import { VehicleType } from "../../../../../../../entities/vehicle/types";
import { ServiceOrderModel } from "../../../../../../../entities/service_order/model";
import { usePersistedStore } from "../../../../../../../store/store";
import { useCompanyApiServices } from "../../../../../../api/companies";
import { ServiceInfoComponent } from "./service_info";
import PaginationComponent from "../../../../../../../components/datatable/pagination";
import ButtonComponent from "../../../../../../../components/buttons/component";

interface IProps {
  vehicle_type: VehicleType;
  selectedServicesOrders: ServiceOrderModel[] | null;
  setSelectedServicesOrders: (services: ServiceOrderModel[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SelectServices(props: IProps) {
  const { sessionType } = usePersistedStore().authReducer;

  const {
    perform,
    getCompanyServicesByVehicleTypeResponse,
    isGettingCompanyServices,
  } = useCompanyApiServices.getCompanyServicesByVehicleType();

  const [page, setPage] = useState(1);

  useEffect(() => {
    perform(sessionType!.company_id!, props.vehicle_type, page);
  }, [page]);

  return (
    <div className="w-full h-full">
      {isGettingCompanyServices ? (
        <Spinner />
      ) : getCompanyServicesByVehicleTypeResponse === null ||
        getCompanyServicesByVehicleTypeResponse.data === null ||
        getCompanyServicesByVehicleTypeResponse.data.data === null ? (
        <p className="text-red-500">Error obteniendo servicios</p>
      ) : (
        <div className="w-full h-full">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <p className="col-span-2">Servicio</p>
            <p>Categoria</p>
            <p>Precio</p>
          </div>
          <Divider />
          <ServiceInfoComponent
            services={getCompanyServicesByVehicleTypeResponse.data.data}
            vehicle_type={props.vehicle_type}
            selectedServiceOrders={props.selectedServicesOrders}
            setSelectedServiceOrders={props.setSelectedServicesOrders}
          />
          <div className="w-full flex justify-end mt-5">
            <PaginationComponent
              page={page}
              pages={
                getCompanyServicesByVehicleTypeResponse.data.total_pages || 0
              }
              setPage={setPage}
            />
          </div>
        </div>
      )}
      <div className="w-full flex justify-end gap-2 mt-5">
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Atrás"
            type="button"
            onClick={() => props.onPrev()}
            variant="light"
          />
        </div>
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Siguiente"
            type="button"
            onClick={() => props.onNext()}
            variant="solid"
            isDisabled={
              props.selectedServicesOrders === null ||
              props.selectedServicesOrders.length === 0
            }
          />
        </div>
      </div>
    </div>
  );
}
