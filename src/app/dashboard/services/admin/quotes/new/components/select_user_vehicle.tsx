import { useEffect, useState } from "react";
import VehicleModel from "../../../../../../../entities/vehicle/model";
import { usePersistedStore } from "../../../../../../../store/store";
import { useUsersApiServices } from "../../../../../../api/users";
import { Spinner } from "@nextui-org/react";
import DatatableComponent from "../../../../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../../../../components/datatable/types";
import ButtonComponent from "../../../../../../../components/buttons/component";
import PaginationComponent from "../../../../../../../components/datatable/pagination";

type Props = {
  user_id: number;
  selectedVehicle: VehicleModel | null;
  setSelectedVehicle: (vehicle: VehicleModel) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
};

const VEHICLES_COLUMNS: DatatableColumnsProps[] = [
  {
    key: "brand",
    label: "Marca",
  },
  {
    key: "vehicle_type",
    label: "Tipo de vehículo",
  },
  {
    key: "license_plate",
    label: "Placa",
  },
];

export function SelectUserVehicleForQuoteComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const [page, setPage] = useState<number>(1);

  const { isGettingVehicles, userVehiclesResponse, perform } =
    useUsersApiServices.getUserVehicles();

  useEffect(() => {
    perform(props.user_id, page, token!);
  }, [page]);

  function handleSelectVehicle(selectedData: number[] | "all") {
    console.log("selectedData", selectedData);
    if (
      userVehiclesResponse &&
      userVehiclesResponse.data &&
      selectedData !== "all"
    ) {
      const vehicle = userVehiclesResponse.data.data.find(
        (vehicle) => vehicle.id === selectedData[0]
      );
      if (vehicle) {
        props.setSelectedVehicle(vehicle);
      }
    }
  }

  return (
    <div className="w-full h-full">
      {!userVehiclesResponse ||
      !userVehiclesResponse.data ? null : isGettingVehicles ? (
        <Spinner />
      ) : (
        <DatatableComponent
          columns={VEHICLES_COLUMNS}
          noContentMessage="No se encontraron vehículos para el usuario"
          selectionMode="single"
          selectedData={
            props.selectedVehicle ? [props.selectedVehicle.id!] : []
          }
          setSelectedData={handleSelectVehicle}
          data={userVehiclesResponse.data.data.map((vehicle) => ({
            id: vehicle.id,
            brand: vehicle.model!.brand!.name,
            vehicle_type: vehicle.vehicle_type,
            license_plate: vehicle.license_plate,
          }))}
        />
      )}
      <div className="mt-3 w-full flex justify-end items-center">
        <PaginationComponent
          page={page}
          pages={userVehiclesResponse?.data?.total_pages || 0}
          setPage={setPage}
        />
      </div>
      <div className="w-full flex justify-end items-center gap-3 mt-5">
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
            onClick={() => props.onNextStep()}
            isDisabled={!props.selectedVehicle}
          />
        </div>
      </div>
    </div>
  );
}
