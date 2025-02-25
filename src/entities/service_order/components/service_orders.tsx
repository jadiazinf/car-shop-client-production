import { useContext, useState } from "react";
import { ServiceOrderModel, ServiceOrderStatus } from "../model";
import ButtonComponent from "../../../components/buttons/component";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import LogoComponent from "../../../components/logo/component";
import TextComponent from "../../../components/inputs/text";
import { NumberInputHelper } from "../../../components/inputs/helpers";
import { useServiceOrderApiServices } from "../../../app/api/services_orders";
import { usePersistedStore } from "../../../store/store";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { ToasterContext } from "../../../components/toaster/context/context";
import { ServiceOrderHelpers } from "../helpers";
import SelectComponent from "../../../components/inputs/select";
import { OrderStatus } from "../../order/model";

type Props = {
  service_order: ServiceOrderModel;
  order_id: number;
  order_status: OrderStatus;
};

export function CompanyServiceOrderInfoComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    isOpen: isUpdateStatusOpen,
    onOpen: onUpdateStatusOpen,
    onOpenChange: onUpdateStatusOpenChange,
  } = useDisclosure();

  const { isUpdatingServiceOrder, perform: updateServiceOrder } =
    useServiceOrderApiServices.updateServiceOrder();

  const [newServiceStatus, setNewServiceStatus] = useState<
    ServiceOrderStatus.CANCELED | ServiceOrderStatus.FINISHED
  >(ServiceOrderStatus.FINISHED);

  const [newServiceCost, setNewServiceCost] = useState<string>(
    Number(props.service_order.cost).toFixed(2)
  );

  const navigate = useNavigate();

  function handleCostChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, newServiceCost);
    setNewServiceCost(value);
  }

  async function handleServiceCostUpdate() {
    const response = await updateServiceOrder(
      {
        id: props.service_order.id,
        cost: Number(newServiceCost),
      } as ServiceOrderModel,
      token!
    );
    if (response.status === StatusCodes.OK) {
      toasterDispatch({
        payload: "Costo del servicio actualizado correctamente",
        type: "SUCCESS",
      });
      onClose();
      navigate(0);
      return;
    } else {
      toasterDispatch({
        payload:
          (response.data as { errors: string[] })?.errors[0] ||
          "Error al actualizar el costo del servicio",
        type: "ERROR",
      });
    }
  }

  async function handleServiceStatusUpdate() {
    const response = await updateServiceOrder(
      {
        id: props.service_order.id,
        status: newServiceStatus,
      } as ServiceOrderModel,
      token!
    );
    if (response.status === StatusCodes.OK) {
      toasterDispatch({
        payload: "Estado del servicio actualizado correctamente",
        type: "SUCCESS",
      });
      onClose();
      navigate(0);
      return;
    } else {
      toasterDispatch({
        payload:
          (response.data as { errors: string[] })?.errors[0] ||
          "Error al actualizar el estado del servicio",
        type: "ERROR",
      });
    }
  }

  return (
    <>
      <Modal
        className="p-5"
        radius="sm"
        isOpen={isUpdateStatusOpen}
        onOpenChange={onUpdateStatusOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <LogoComponent />
              <div className="mt-5 text-center">
                <p>
                  Actualización del estado del servicio{" "}
                  <strong>{props.service_order.service!.name}</strong>
                </p>
              </div>
              <div className="w-56 my-5">
                <SelectComponent
                  data={[
                    {
                      key: ServiceOrderStatus.FINISHED,
                      label: "Completado",
                    },
                    {
                      key: ServiceOrderStatus.CANCELED,
                      label: "Cancelado",
                    },
                  ]}
                  name="status"
                  onChange={(e) =>
                    setNewServiceStatus(
                      e.target.value as
                        | ServiceOrderStatus.FINISHED
                        | ServiceOrderStatus.CANCELED
                    )
                  }
                  value={newServiceStatus}
                />
              </div>
              <div className="flex mt-5">
                <div className="w-auto">
                  <ButtonComponent
                    color="primary"
                    text="Actualizar"
                    type="button"
                    variant="solid"
                    onClick={handleServiceStatusUpdate}
                    isLoading={isUpdatingServiceOrder}
                  />
                </div>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <Modal
        className="p-5"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <LogoComponent />
              <div className="mt-5">
                <p>
                  Actualización de costo del servicio{" "}
                  <strong>{props.service_order.service!.name}</strong>
                </p>
              </div>
              <div className="w-auto my-5">
                <TextComponent
                  name="service_cost"
                  type="text"
                  label="Costo del servicio"
                  value={newServiceCost}
                  onKeyDown={handleCostChange}
                />
              </div>
              <div className="flex mt-5">
                <div className="w-auto">
                  <ButtonComponent
                    color="primary"
                    text="Actualizar"
                    type="button"
                    variant="solid"
                    onClick={handleServiceCostUpdate}
                    isLoading={isUpdatingServiceOrder}
                  />
                </div>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full h-full flex justify-between items-center">
        <div className="w-full flex gap-2 items-center">
          <p className="font-semibold text-xl">
            {props.service_order.service?.name || ""}
          </p>
          <p className="text-black text-opacity-50">
            {`(${props.service_order.service?.description || ""})`}
          </p>
        </div>
        <div className="w-full flex gap-5 items-center justify-end">
          {props.service_order.status !==
            ServiceOrderStatus.PENDING_FOR_QUOTE_APPROVEMENT && (
            <div className="flex gap-2 items-center">
              <div className="w-auto">
                <Button
                  type="button"
                  variant="light"
                  onClick={() =>
                    navigate(
                      `/dashboard/services/orders/${
                        props.order_id
                      }/advances/${props.service_order.id!}/${
                        props.service_order.service?.company_id
                      }`
                    )
                  }
                >
                  Avances
                </Button>
              </div>
              <p>
                {ServiceOrderHelpers.translateServiceOrderStatus(
                  props.service_order
                )}
              </p>
              {props.order_status === OrderStatus.IN_PROGRESS &&
                props.service_order.status ===
                  ServiceOrderStatus.IN_PROGRESS && (
                  <>
                    <div className="w-auto">
                      <ButtonComponent
                        color="secondary"
                        text="Modificar Estado"
                        type="button"
                        variant="light"
                        onClick={onUpdateStatusOpen}
                      />
                    </div>
                  </>
                )}
            </div>
          )}
          <p>{`${Number(props.service_order.cost).toFixed(2)} REF`}</p>
          {props.order_status === OrderStatus.IN_PROGRESS && (
            <div className="flex flex-col justify-end items-center">
              <div className="flex gap-2 items-center">
                <div className="w-auto">
                  <ButtonComponent
                    color="primary"
                    text="Modificar Costo"
                    type="button"
                    variant="light"
                    onClick={onOpen}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
