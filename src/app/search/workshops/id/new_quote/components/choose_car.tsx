import { useEffect, useState } from "react";
import VehicleModel from "../../../../../../entities/vehicle/model";
import { useUsersApiServices } from "../../../../../api/users";
import { usePersistedStore } from "../../../../../../store/store";
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import ButtonComponent from "../../../../../../components/buttons/component";
import TextComponent from "../../../../../../components/inputs/text";
import { NumberInputHelper } from "../../../../../../components/inputs/helpers";
import PaginationComponent from "../../../../../../components/datatable/pagination";
import LogoComponent from "../../../../../../components/logo/component";

type Props = {
  selectedCar?: VehicleModel;
  setSelectedCar: (car: VehicleModel) => void;
  setVehicleMileage: (mileage: number) => void;
  onConfirm: () => void;
};

export function ChooseCarForQuoteComponent(props: Props) {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { isGettingVehicles, perform, userVehiclesResponse } =
    useUsersApiServices.getUserVehicles();

  const [page, setPage] = useState(1);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(
    null
  );

  const [vehicleMileage, setVehicleMileage] = useState<string>("0.00");

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  useEffect(() => {
    perform(sessionType!.user.id!, page, token!);
  }, []);

  function handleMileageChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, vehicleMileage);
    setVehicleMileage(value);
  }

  function handleSelectVehicle(vehicle: VehicleModel) {
    setSelectedVehicle(vehicle);
    onOpen();
  }

  function handleSetVehicleAndMileage() {
    props.setVehicleMileage(parseFloat(vehicleMileage));
    props.setSelectedCar(selectedVehicle!);
    props.onConfirm();
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
                  type="text"
                  value={vehicleMileage}
                  onKeyDown={handleMileageChange}
                />
              </div>
              <div className="w-auto mt-5">
                <ButtonComponent
                  color="primary"
                  text="Confirmar vehículo para cotización"
                  type="button"
                  variant="solid"
                  isDisabled={
                    !selectedVehicle || parseFloat(vehicleMileage) <= 0
                  }
                  onClick={handleSetVehicleAndMileage}
                />
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div>
        {isGettingVehicles ? (
          <Spinner />
        ) : !userVehiclesResponse || !userVehiclesResponse.data ? (
          <p>Error al obtener los vehículos del usuario</p>
        ) : !userVehiclesResponse.data.data ||
          userVehiclesResponse?.data?.data.length === 0 ? (
          <p>No tienes vehículos registrados</p>
        ) : (
          <div>
            <p className="text-2xl font-semibold mb-5">
              Elegir vehículo para cotización
            </p>
            {userVehiclesResponse.data.data.map((vehicle) => (
              <div
                className={`${
                  props.selectedCar?.id! === vehicle.id
                    ? "border-primary"
                    : "border-black border-opacity-40"
                }  border-1.5 rounded-md p-2 w-full cursor-pointer`}
                key={vehicle.id}
                onClick={() => handleSelectVehicle(vehicle)}
              >
                <div className="font-semibold text-lg">
                  <p>{`${vehicle.model!.brand!.name} ${
                    vehicle.model!.name
                  }`}</p>
                </div>
                <p className="text-sm">{`Año: ${vehicle.year}`}</p>
                <p className="text-sm">{`Placa: ${vehicle.license_plate}`}</p>
              </div>
            ))}
            <div className="mt-5 w-full flex justify-end">
              <PaginationComponent
                page={page}
                pages={userVehiclesResponse.data.total_pages}
                setPage={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
