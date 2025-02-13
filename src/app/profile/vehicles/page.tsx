import { useContext, useEffect, useState } from "react";
import { useUsersApiServices } from "../../api/users";
import { usePersistedStore } from "../../../store/store";
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import DatatableComponent from "../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../components/datatable/types";
import ButtonComponent from "../../../components/buttons/component";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../../components/datatable/pagination";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import useDatatableAction from "../../../components/datatable/use_action";
import VehicleModel from "../../../entities/vehicle/model";
import { DeleteVehicleConfirmation } from "./components/delete_vehicle_confirmation";

const VEHICLE_TABLE_COLUMNS: DatatableColumnsProps[] = [
  {
    key: "brand",
    label: "Marca",
  },
  {
    key: "model",
    label: "Modelo",
  },
  {
    key: "color",
    label: "Color",
  },
  {
    key: "license_plate",
    label: "Placa",
  },
  {
    key: "actions",
    label: "Acciones",
  },
];

const BreadCrumbsItems: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Perfil",
    url: "/profile",
  },
  {
    text: "Mis vehículos",
    url: "/profile/vehicles",
  },
];

export default function ProfileVehiclesPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  setBreadcrumbs(BreadCrumbsItems);

  const { sessionType, token } = usePersistedStore().authReducer;

  const [page, setPage] = useState(1);

  const {
    isGettingVehicles,
    userVehiclesResponse,
    perform: getUserVehicles,
  } = useUsersApiServices.getUserVehicles();

  const navigate = useNavigate();

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleModel | null>(
    null
  );

  const {
    isOpen: isDeleteVehicleModalOpen,
    onOpen: onDeleteVehicleModalOpen,
    onOpenChange: onDeleteVehicleModalOpenChange,
  } = useDisclosure();

  useEffect(() => {
    getUserVehicles(sessionType!.user.id!, page, token!);
  }, [page]);

  useEffect(() => {
    if (vehicleToDelete) onDeleteVehicleModalOpen();
  }, [vehicleToDelete]);

  useEffect(() => {
    if (datatableAction.action === "view")
      navigate(`/profile/vehicles/${datatableAction.id!}`);
    if (datatableAction.action === "delete")
      handleDeleteVehicleModal(datatableAction.id!);
  }, [datatableAction.action]);

  function transformData() {
    if (userVehiclesResponse?.data && userVehiclesResponse.data.data) {
      return userVehiclesResponse.data.data.map((element) => ({
        id: element.id,
        brand: element.model!.brand!.name,
        model: element.model!.name,
        color: element.color,
        license_plate: element.license_plate,
      }));
    } else {
      return [];
    }
  }

  function handleDeleteVehicleModal(vehicle_id: number) {
    if (userVehiclesResponse) {
      const vehicle = userVehiclesResponse.data?.data.find(
        (element) => element.id === vehicle_id
      )!;
      setVehicleToDelete(vehicle);
    }
  }

  return (
    <>
      <Modal
        isOpen={isDeleteVehicleModalOpen}
        onOpenChange={onDeleteVehicleModalOpenChange}
        size="xl"
        radius="sm"
        className="p-5"
      >
        <ModalBody>
          <ModalContent>
            <DeleteVehicleConfirmation
              vehicle={vehicleToDelete || ({} as VehicleModel)}
            />
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full">
        <div className="w-full flex justify-between mb-5">
          <div>
            <p className="font-semibold text-2xl font-inter">Mis vehículos</p>
          </div>
          <div className="w-auto">
            <ButtonComponent
              color="primary"
              text="Agregar vehículo"
              type="button"
              variant="solid"
              startContent={<IoAdd className="w-5 h-5" />}
              onClick={() => navigate("/profile/vehicles/new")}
            />
          </div>
        </div>
        {isGettingVehicles ? (
          <Spinner />
        ) : !userVehiclesResponse ? (
          <p>Error al buscar vehículos, por favor intente de nuevo más tarde</p>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <DatatableComponent
              columns={VEHICLE_TABLE_COLUMNS}
              data={transformData()}
              isLoading={isGettingVehicles}
              actionState={datatableAction}
              setActionState={setDatatableAction}
              isRowDataDeletable
              isRowDataViewable
              noContentMessage="No hay data"
            />
            <div className="w-full flex justify-between mt-2">
              <div>
                <p className="text-black text-opacity-50">{`${
                  userVehiclesResponse.data?.total_count
                } ${
                  userVehiclesResponse.data?.total_count === 1
                    ? "vehículo registrado"
                    : "vehículos registrados"
                }`}</p>
              </div>
              <PaginationComponent
                page={page}
                pages={userVehiclesResponse.data?.total_pages || 0}
                setPage={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
