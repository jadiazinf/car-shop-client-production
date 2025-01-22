import { useEffect, useState } from "react";
import { usePersistedStore } from "../../../../../store/store";
import { useUsersApiServices } from "../../../../api/users";
import DatatableComponent from "../../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../../components/datatable/types";
import PaginationComponent from "../../../../../components/datatable/pagination";
import ButtonComponent from "../../../../../components/buttons/component";
import { VEHICLE_TYPES_ARR } from "../../../../../entities/vehicle/types";
import VehicleModel from "../../../../../entities/vehicle/model";

type Props = {
  onHandleConfirm: (vehicle: VehicleModel) => void;
};

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "brand", label: "Marca" },
  { key: "model", label: "Modelo" },
  { key: "year", label: "Año" },
  { key: "licensePlate", label: "Placa" },
  { key: "vehicleType", label: "Tipo de vehículo" },
];

export function ChooseCarForQuoteAndConfirm(props: Props) {
  const { token, sessionType } = usePersistedStore().authReducer;

  const [page, setPage] = useState<number>(1);

  const { perform, isGettingVehicles, userVehiclesResponse } =
    useUsersApiServices.getUserVehicles();

  const [selectedVehicle, setSelectedVehicle] = useState<
    number[] | "all" | null
  >(null);

  useEffect(() => {
    perform(sessionType!.user.id!, page, token!);
  }, [page]);

  function handleConfirm() {
    const vehicle = userVehiclesResponse?.data?.data.find(
      (element) => element.id === selectedVehicle![0]
    );
    props.onHandleConfirm(vehicle!);
  }

  return (
    <div className="w-full flex flex-col">
      <p className="font-inter font-medium text-md mb-5">
        Seleccione un vehículo
      </p>
      <DatatableComponent
        columns={DATATABLE_COLUMNS}
        data={
          userVehiclesResponse?.data?.data.map((vehicle) => ({
            id: vehicle.id!,
            brand: vehicle.model!.brand!.name,
            model: vehicle.model!.name!,
            year: vehicle.year!,
            licensePlate: vehicle.license_plate!,
            vehicleType: VEHICLE_TYPES_ARR.find(
              (element) => element.key === vehicle.vehicle_type
            )?.label,
          })) || []
        }
        isLoading={isGettingVehicles}
        selectedData={
          typeof selectedVehicle === "number" ? [selectedVehicle] : []
        }
        setSelectedData={setSelectedVehicle}
        selectionMode="single"
        noContentMessage="No hay vehículos registrados"
        showCheckboxes
      />
      <div className="w-full flex justify-end mt-3">
        <PaginationComponent
          page={page}
          pages={userVehiclesResponse?.data?.total_pages || 0}
          setPage={setPage}
        />
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Confirmar"
            type="button"
            variant="solid"
            isLoading={false}
            isDisabled={
              selectedVehicle === null || selectedVehicle.length === 0
            }
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
}
