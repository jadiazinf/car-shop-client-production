import { useEffect, useState } from "react";
import ButtonComponent from "../../../../../../components/buttons/component";
import VehicleModel from "../../../../../../entities/vehicle/model";
import { useUsersApiServices } from "../../../../../api/users";
import { usePersistedStore } from "../../../../../../store/store";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import LogoComponent from "../../../../../../components/logo/component";
import TextComponent from "../../../../../../components/inputs/text";
import DatatableComponent from "../../../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../../../components/datatable/types";
import PaginationComponent from "../../../../../../components/datatable/pagination";
import { VehicleHelpers } from "../../../../../../entities/vehicle/helpers";

interface IProps {
  user_id: number;
  selectedVehicle: VehicleModel | null;
  setSelectedVehicle: (vehicle: VehicleModel | null) => void;
  setVehicleMileage: (mileage: number | null) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  {
    key: "brand",
    label: "Marca",
  },
  {
    key: "model",
    label: "Modelo",
  },
  {
    key: "vehicle_type",
    label: "Tipo de vehículo",
  },
  {
    key: "year",
    label: "Año",
  },
  {
    key: "license_plate",
    label: "Placa",
  },
  {
    key: "color",
    label: "Color",
  },
];

export function SearchUserVehicleForNewOrderService(props: IProps) {
  const { token } = usePersistedStore().authReducer;

  const { isGettingVehicles, perform, userVehiclesResponse } =
    useUsersApiServices.getUserVehicles();

  const [vehicle, setVehicle] = useState<VehicleModel | null>(
    props.selectedVehicle || null
  );

  const [vehicleMileage, setVehicleMileage] = useState<number>(0);

  const [page, setPage] = useState(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    perform(props.user_id, page, token!);
  }, [page]);

  function handleSelectVehicle() {
    props.setSelectedVehicle(vehicle);
    props.setVehicleMileage(vehicleMileage);
    props.onNext();
  }

  const handleDatatbleSelectVehicle = (id: number[] | "all") => {
    if (id === "all") return;

    if ((vehicle && vehicle.id === id[0]) || id.length === 0) {
      setVehicle(null);
      return;
    }

    const selectedVehicle = userVehiclesResponse?.data?.data.find(
      (element) => element.id === id[0]
    );

    if (selectedVehicle) {
      setVehicle(selectedVehicle);
    }
  };

  return (
    <>
      <Modal
        className="p-5"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
              <LogoComponent size="md" />
              <p>Ingrese el kilometraje del vehículo</p>
              <div className="w-auto">
                <TextComponent
                  name="vehicle_mileage"
                  type="number"
                  label="Kilometraje del vehículo"
                  value={vehicleMileage.toString()}
                  onChange={(event) => setVehicleMileage(Number(event.target.value))}
                  step={1}
                />
              </div>
              <div className="w-auto">
                <ButtonComponent
                  text="Guardar"
                  color="primary"
                  type="button"
                  variant="solid"
                  onClick={handleSelectVehicle}
                />
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full h-full">
        <p className="text-xl font-semibold mb-5">
          Seleccionar vehículo para nueva orden de servicio
        </p>
        <div className="w-full h-full">
          <DatatableComponent
            columns={DATATABLE_COLUMNS}
            data={
              userVehiclesResponse === null ||
              userVehiclesResponse.data === null
                ? []
                : userVehiclesResponse.data.data.map((vehicle) => ({
                    id: vehicle.id,
                    brand: vehicle.model!.brand!.name,
                    model: vehicle.model!.name,
                    vehicle_type: VehicleHelpers.translateVehicleType(
                      vehicle.vehicle_type
                    ),
                    year: vehicle.year,
                    license_plate: vehicle.license_plate,
                    color: vehicle.color,
                  }))
            }
            isLoading={isGettingVehicles}
            selectedData={
              props.selectedVehicle
                ? [props.selectedVehicle.id!]
                : vehicle
                ? [vehicle.id!]
                : []
            }
            setSelectedData={handleDatatbleSelectVehicle}
            selectionMode="multiple"
            showCheckboxes
          />
          <div className="w-full flex justify-end">
            <PaginationComponent
              page={page}
              pages={userVehiclesResponse?.data?.total_pages || 0}
              setPage={setPage}
            />
          </div>
        </div>
        <div className="w-full mt-3 flex justify-end gap-2">
          <div className="w-auto">
            <ButtonComponent
              text="Atrás"
              color="primary"
              type="button"
              variant="bordered"
              onClick={() => props.onPrev()}
            />
          </div>
          <div className="w-auto">
            <ButtonComponent
              text="Siguiente"
              color="primary"
              type="button"
              variant="solid"
              isDisabled={vehicle === null}
              onClick={onOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
}
