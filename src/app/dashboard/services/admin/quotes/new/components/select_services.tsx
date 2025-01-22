import { useEffect, useState } from "react";
import ButtonComponent from "../../../../../../../components/buttons/component";
import ServiceModel from "../../../../../../../entities/service/model";
import { usePersistedStore } from "../../../../../../../store/store";
import { useCompanyApiServices } from "../../../../../../api/companies";
import DatatableComponent from "../../../../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../../../../components/datatable/types";
import ServicePricesComponent from "../../../../../../../entities/service/components/prices/component";
import PaginationComponent from "../../../../../../../components/datatable/pagination";
import { VehicleType } from "../../../../../../../entities/vehicle/types";

type Props = {
  vehicle_type: VehicleType;
  selectedServices: ServiceModel[];
  onSelectService: (service: ServiceModel[]) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
};

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "category", label: "Categoría" },
  { key: "prices", label: "Precios" },
];

export default function SelectServicesComponent(props: Props) {
  const { sessionType } = usePersistedStore().authReducer;

  const [page, setPage] = useState<number>(1);

  const { getCompanyServicesResponse, isGettingCompanyServices, perform } =
    useCompanyApiServices.getCompanyServices();

  useEffect(() => {
    perform(sessionType!.company_id!, page);
  }, [page]);

  function handleServicesSelection(services: number[] | "all") {
    if (services === "all") {
      const combinedUniqueServices = Array.from(
        new Set([
          ...props.selectedServices,
          ...getCompanyServicesResponse!.data!.data,
        ])
      );
      props.onSelectService(combinedUniqueServices);
    } else {
      const selectedServices = getCompanyServicesResponse!.data!.data.filter(
        (element) => services.includes(element.id!)
      );
      props.onSelectService(selectedServices);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center text-sm text-black text-opacity-70 mb-5">
        <p>Seleccionar servicios para la cotización</p>
      </div>
      {!getCompanyServicesResponse ||
      !getCompanyServicesResponse.data ? null : (
        <DatatableComponent
          isLoading={isGettingCompanyServices}
          columns={DATATABLE_COLUMNS}
          selectionMode="multiple"
          showCheckboxes
          selectedData={props.selectedServices.map((service) => service.id!)}
          setSelectedData={handleServicesSelection}
          data={getCompanyServicesResponse.data.data.map(
            (service: ServiceModel) => ({
              id: service.id,
              name: service.name,
              description: service.description,
              category: service.category?.name,
              prices: <ServicePricesComponent service={service} />,
            })
          )}
        />
      )}
      <div className="w-full flex items-center justify-end mt-3">
        <PaginationComponent
          page={page}
          pages={getCompanyServicesResponse?.data?.total_pages || 0}
          setPage={setPage}
        />
      </div>
      <div className="w-full flex items-center justify-end mt-5 gap-3">
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Regresar"
            type="button"
            variant="bordered"
            onClick={props.onPrevStep}
          />
        </div>
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Siguiente"
            type="button"
            variant="solid"
            onClick={props.onNextStep}
            isDisabled={props.selectedServices.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
