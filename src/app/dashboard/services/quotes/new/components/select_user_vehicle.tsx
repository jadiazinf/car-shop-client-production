import { useEffect, useState } from "react";
import VehicleModel from "../../../../../../entities/vehicle/model";
import { usePersistedStore } from "../../../../../../store/store";
import { useUsersApiServices } from "../../../../../api/users";
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import DatatableComponent from "../../../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../../../components/datatable/types";
import ButtonComponent from "../../../../../../components/buttons/component";
import PaginationComponent from "../../../../../../components/datatable/pagination";
import LogoComponent from "../../../../../../components/logo/component";
import TextComponent from "../../../../../../components/inputs/text";

type Props = {
  user_id: number;
  selectedVehicle: VehicleModel | null;
  setSelectedVehicle: (vehicle: VehicleModel) => void;
  setVehicleMileage: (mileage: number) => void;
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

  const [vehicleMileage, setVehicleMileage] = useState<number>(0);

  const [vehicle, setSelectedVehicle] = useState<VehicleModel | null>(
    props.selectedVehicle
  );

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  useEffect(() => {
    perform(props.user_id, page, token!);
  }, [page]);

  function handleSelectVehicle(selectedData: number[] | "all") {
    if (
      userVehiclesResponse &&
      userVehiclesResponse.data &&
      selectedData !== "all"
    ) {
      const vehicle = userVehiclesResponse.data.data.find(
        (vehicle) => vehicle.id === selectedData[0]
      );
      if (vehicle) {
        setSelectedVehicle(vehicle);
      }
    }
  }

  function handleOpenModal() {
    setSelectedVehicle(vehicle);
    onOpen();
  }

  function handleSetVehicleAndMileage() {
    props.setVehicleMileage(vehicleMileage);
    props.setSelectedVehicle(vehicle!);
    props.onNextStep();
  }

  return (
    <>
      <Modal
        radius="sm"
        className="p-5"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="w-full flex flex-col justify-center items-center">
              <LogoComponent />
              <div className="w-auto mt-5">
                <TextComponent
                  name="vehicle_mileage"
                  label="Kilometraje del vehículo"
                  type="number"
                  value={vehicleMileage.toString()}
                  onChange={(event) => setVehicleMileage(Number(event.target.value))}
                />
              </div>
              <div className="w-auto mt-5">
                <ButtonComponent
                  color="primary"
                  text="Confirmar vehículo para cotización"
                  type="button"
                  variant="solid"
                  isDisabled={!vehicle || vehicleMileage <= 0}
                  onClick={handleSetVehicleAndMileage}
                />
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full h-full">
        {!userVehiclesResponse ||
        !userVehiclesResponse.data ? null : isGettingVehicles ? (
          <Spinner />
        ) : (
          <DatatableComponent
            columns={VEHICLES_COLUMNS}
            noContentMessage="No se encontraron vehículos para el usuario"
            selectionMode="multiple"
            showCheckboxes={false}
            selectedData={vehicle ? [vehicle.id!] : []}
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
              onClick={handleOpenModal}
              isDisabled={!vehicle}
            />
          </div>
        </div>
      </div>
    </>
  );
}
