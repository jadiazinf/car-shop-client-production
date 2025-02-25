import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import ButtonComponent from "../../../components/buttons/component";
import DatesHelpers from "../../../helpers/dates/helper";
import { usePersistedStore } from "../../../store/store";
import { UserCompanyRole } from "../../users_companies/types";
import { OrdersHelpers } from "../helpers";
import { OrderModel, OrderStatus } from "../model";
import { useCompanyApiServices } from "../../../app/api/companies";
import { useContext, useEffect, useState } from "react";
import DatatableComponent from "../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../components/datatable/types";
import { PaginatedData } from "../../../helpers/application_response/types";
import { UserCompanyModel } from "../../users_companies/model";
import { UserCompanyHelpers } from "../../users_companies/helpers";
import PaginationComponent from "../../../components/datatable/pagination";
import { useOrderApiServices } from "../../../app/api/orders";
import { ToasterContext } from "../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";

type Props = {
  order: OrderModel;
};

const TABLE_COLUMNS: DatatableColumnsProps[] = [
  {
    key: "full_name",
    label: "Nombre",
  },
  {
    key: "role",
    label: "Rol en la compañía",
  },
];

export function OrderDetailComponent(props: Props) {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [page, setPage] = useState<number | null>(null);

  const { getEmployeesResponse, isGettingEmployees, perform } =
    useCompanyApiServices.getEmployees();

  const { isAssigningServiceOrder, perform: assignEmployeeToOrder } =
    useOrderApiServices.addAssignedTo();

  const [selectedMemberToOrder, setSelectedMemberToOrder] = useState<
    number | null
  >(null);

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      perform(sessionType?.company_id!, page as number, token!);
    }
  }, [page]);

  useEffect(() => {
    if (!isOpen) {
      setPage(null);
    }
  }, [isOpen]);

  function handleOpenModal() {
    setPage(1);
    onOpen();
  }

  function handleMemberSelection(value: any) {
    if (value === "all") return;

    if (value) {
      if (value.length == 1) setSelectedMemberToOrder(value[0]);
      else setSelectedMemberToOrder(value.at(-1));
    } else setSelectedMemberToOrder(null);
  }

  async function handleAssignMember() {
    if (selectedMemberToOrder) {
      const response = await assignEmployeeToOrder(
        props.order.id!,
        selectedMemberToOrder,
        sessionType!.company_id!,
        token!
      );
      if (response.status === StatusCodes.OK) {
        toasterDispatch({
          payload: "Miembro asignado a servicio correctamente",
          type: "SUCCESS",
        });
        navigate(0);
        return;
      }

      const errorMessage =
        "errors" in response.data
          ? response.data.errors[0]
          : "Error al asignar miembro a servicio";
      toasterDispatch({ payload: errorMessage, type: "ERROR" });
    }
  }

  return (
    <>
      <Modal
        className="p-7"
        radius="sm"
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="w-full h-full">
              <p className="font-semibold mb-5">Empleados de la companía</p>
              <DatatableComponent
                columns={TABLE_COLUMNS}
                selectedData={
                  selectedMemberToOrder ? [selectedMemberToOrder] : []
                }
                selectionMode="multiple"
                setSelectedData={handleMemberSelection}
                data={
                  (
                    getEmployeesResponse?.data as PaginatedData<UserCompanyModel>
                  )?.data?.map((element) => ({
                    id: element.id,
                    full_name: `${element.user?.first_name} ${element.user?.last_name}`,
                    role: UserCompanyHelpers.translateUserCompanyRole(
                      UserCompanyHelpers.getRoleWithGreaterHierarchy(
                        element.roles as UserCompanyRole[]
                      )
                    ),
                  })) || []
                }
                isLoading={isGettingEmployees}
              />
              <div className="w-full flex justify-end mt-5">
                <PaginationComponent
                  page={page || 0}
                  setPage={setPage}
                  pages={
                    (
                      getEmployeesResponse?.data as PaginatedData<UserCompanyModel>
                    )?.total_pages || 0
                  }
                />
              </div>
              <div className="w-full flex justify-center mt-5">
                <div className="w-auto">
                  <ButtonComponent
                    color="primary"
                    text="Asignar miembro a orden"
                    type="button"
                    variant="solid"
                    onClick={handleAssignMember}
                    isDisabled={!selectedMemberToOrder}
                    isLoading={isAssigningServiceOrder}
                  />
                </div>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
        <p className="font-bold text-lg mb-3">
          Información de orden de servicio
        </p>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="w-full">{`Fecha de creación: ${DatesHelpers.formatFullDate(
              props.order.created_at as string
            )}`}</p>
            <p className="w-full">{`Estado de la ${
              props.order.status === OrderStatus.QUOTE ? "Cotización" : "Orden"
            }: ${
              props.order.status === OrderStatus.QUOTE
                ? props.order.is_checked
                  ? "Revisada"
                  : "En revisión"
                : OrdersHelpers.translateOrderStatus(props.order)
            }`}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="w-full">{`${
              props.order.status === OrderStatus.QUOTE ? "Cotización" : "Orden"
            } activa: ${props.order.is_active ? "Sí" : "No"}`}</p>
            <p className="w-full">{`Costo total de la orden de servicio: ${props.order.services_orders
              ?.reduce((prev, curr) => prev + Number(curr.cost), 0)
              .toFixed(2)} REF`}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="w-full">{`${
              props.order.status === OrderStatus.QUOTE ? "Cotización" : "Orden"
            } revisada por la compañía: ${
              props.order.is_checked ? "Sí" : "No"
            }`}</p>
            <div className="flex w-full items-center flex-col md:flex-row gap-2">
              <p>
                {`Trabajador a cargo: ${
                  props.order.assigned_to?.user?.first_name ||
                  "No hay técnico a cargo"
                }`}
              </p>
              {sessionType?.roles?.includes(
                UserCompanyRole.ADMIN || UserCompanyRole.SUPERVISOR
              ) &&
              sessionType.company_id === props.order.company_id &&
              !props.order.assigned_to_id ? (
                <div className="flex">
                  <div className="w-auto">
                    <ButtonComponent
                      color="primary"
                      text="Asignar técnico"
                      type="button"
                      variant="light"
                      onClick={handleOpenModal}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
