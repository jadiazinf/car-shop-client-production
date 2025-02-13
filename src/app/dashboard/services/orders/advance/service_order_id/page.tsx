import { useNavigate, useParams } from "react-router-dom";
import { HeaderBreadcrumbItemProps } from "../../../../../../components/breadcrumbs/header";
import { useContext, useEffect, useState } from "react";
import BreadcrumbsContext from "../../../../../../components/breadcrumbs/context";
import { useAdvanceApiServices } from "../../../../../api/advances";
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { AdvanceModel } from "../../../../../../entities/advances/model";
import { usePersistedStore } from "../../../../../../store/store";
import ButtonComponent from "../../../../../../components/buttons/component";
import FileDropzone from "../../../../../../components/dragndrop/component";
import LogoComponent from "../../../../../../components/logo/component";
import { IoMdAdd } from "react-icons/io";
import ViewImagesComponent from "../../../../../../components/images/view_images";
import TextComponent from "../../../../../../components/inputs/text";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../../../../components/toaster/context/context";
import { useServiceOrderApiServices } from "../../../../../api/services_orders";
import { useVehicleApiServices } from "../../../../../api/vehicles";
import VehicleModel from "../../../../../../entities/vehicle/model";

const HEADER_BREADCRUMBS = (
  order_id: number,
  company_id: number
): HeaderBreadcrumbItemProps[] => {
  return [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "Dashboard",
      url: "/dashboard",
    },
    {
      text: "Servicios del taller",
      url: "/dashboard/services",
    },
    {
      text: "Órdenes de servicio",
      url: "/dashboard/services/orders",
    },
    {
      text: "Información de orden de servicio",
      url: `/dashboard/services/orders/${order_id}/${company_id}`,
    },
    {
      text: "Avances de orden de servicio",
      url: "/dashboard/services/orders/advances/:id",
    },
  ];
};

export function ServiceOrderAdvance() {
  const { token } = usePersistedStore().authReducer;

  const { service_order_id, order_id, company_id } = useParams();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const { getServiceOrderAdvancesResponse, isGettingAdvances, perform } =
    useAdvanceApiServices.getServiceOrderAdvances();

  const {
    getServiceOrderResponse,
    isGettingServiceOrder,
    perform: getServiceOrder,
  } = useServiceOrderApiServices.getServiceOrder();

  const navigate = useNavigate();

  const { isCreatingAdvance, perform: createAdvance } =
    useAdvanceApiServices.createAdvance();

  const { isAttachingImages, perform: attachImages } =
    useAdvanceApiServices.attachImageToAdavance();

  const { getVehicleResponse, perform: getVehicle } =
    useVehicleApiServices.getVehicle();

  const [newAdvanceFiles, setNewAdvanceFiles] = useState<File[]>([]);

  const {
    isOpen: isAddAdvancesOpen,
    onOpen: onAddAdvancesOpen,
    onOpenChange: onAddAdvancesOpenChange,
  } = useDisclosure();

  const {
    isOpen: isShowAdvancesOpen,
    onOpen: onShowAdvancesOpen,
    onOpenChange: onShowAdvancesOpenChange,
  } = useDisclosure();

  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    setBreadcrumbs(
      HEADER_BREADCRUMBS(parseInt(order_id!), parseInt(company_id!))
    );
    perform(parseInt(service_order_id!), parseInt(company_id!), token!);
    getServiceOrder(parseInt(service_order_id!), parseInt(company_id!), token!);
  }, []);

  useEffect(() => {
    if (getServiceOrderResponse?.status === StatusCodes.OK) {
      getVehicle(getServiceOrderResponse!.data!.order!.vehicle_id!, token!);
    }
  }, [getServiceOrderResponse]);

  async function handleAddAdvances() {
    const createAdvanceResponse = await createAdvance(
      {
        description,
        service_order_id: parseInt(service_order_id!),
      },
      token!
    );

    if (createAdvanceResponse.status === StatusCodes.CREATED) {
      const attachImagesResponse = await attachImages(
        (createAdvanceResponse.data as AdvanceModel).id!,
        newAdvanceFiles,
        token!
      );
      if (attachImagesResponse.status === StatusCodes.OK) {
        toasterDispatch({
          payload: "Guardado de avance exitoso",
          type: "SUCCESS",
        });
        navigate(0);
        return;
      }

      toasterDispatch({
        payload: "Error guardando las imágenes del avance",
        type: "ERROR",
      });
    }

    toasterDispatch({ payload: "Error guardando el avance", type: "ERROR" });
  }

  return (
    <>
      <Modal
        className="p-5"
        radius="sm"
        size="4xl"
        isOpen={isAddAdvancesOpen}
        onOpenChange={onAddAdvancesOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <LogoComponent size="2xl" />
              <div className="mt-5 w-full h-full">
                <FileDropzone
                  text="Arrastre las imágenes de los avances aquí"
                  onDrop={setNewAdvanceFiles}
                />
              </div>
              {newAdvanceFiles.length > 0 && (
                <div className="flex justify-center flex-col items-center">
                  <div className="mt-5 flex">
                    <div className="w-auto">
                      <ButtonComponent
                        text="Ver imágenes seleccionadas"
                        onClick={onShowAdvancesOpen}
                        color="primary"
                        type="button"
                        variant="light"
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex">
                    <div className="w-auto">
                      <ButtonComponent
                        text="Borrar imágenes seleccionadas"
                        onClick={() => setNewAdvanceFiles([])}
                        color="secondary"
                        type="button"
                        variant="light"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-5 flex">
                <div className="w-auto">
                  <TextComponent
                    name="description"
                    label="Descripción del avance"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="bordered"
                  />
                </div>
              </div>
              <div className="mt-5 flex">
                <div className="w-auto">
                  <ButtonComponent
                    text="Confirmar"
                    onClick={handleAddAdvances}
                    color="primary"
                    type="button"
                    variant="solid"
                    isDisabled={
                      newAdvanceFiles.length === 0 || description.length <= 3
                    }
                    isLoading={isCreatingAdvance || isAttachingImages}
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
        size="4xl"
        isOpen={isShowAdvancesOpen}
        onOpenChange={onShowAdvancesOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="mt-5 w-full h-full">
              <ViewImagesComponent
                images={newAdvanceFiles}
                isCommingFrom="client"
              />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full h-full">
        <div className="w-full h-full">
          <div className="w-full flex justify-end">
            <div>
              <div className="w-auto">
                <ButtonComponent
                  text="Agregar avances"
                  onClick={onAddAdvancesOpen}
                  color="primary"
                  type="button"
                  variant="solid"
                  startContent={<IoMdAdd className="w-5 h-5" />}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-semibold text-lg mb-2">Información del servicio</p>
          {isGettingServiceOrder ? (
            <Spinner />
          ) : (
            <div className="w-full flex flex-col gap-2 ">
              <p>{`Servicio: ${
                getServiceOrderResponse?.data?.service?.name || ""
              }`}</p>
              {!getVehicleResponse || !getVehicleResponse.data ? null : (
                <div className="flex gap-2">
                  <p>
                    {(getVehicleResponse.data as VehicleModel).model!.brand!
                      .name +
                      " " +
                      (getVehicleResponse.data as VehicleModel).model!.name +
                      " (" +
                      (getVehicleResponse.data as VehicleModel).license_plate +
                      ") " +
                      (getVehicleResponse.data as VehicleModel).color ||
                      "Sin vehiculo"}
                  </p>
                </div>
              )}
            </div>
          )}
          <p className="text-2xl font-bold my-5">
            Avances de la orden de servicio
          </p>
        </div>
        {isGettingAdvances ? (
          <Spinner />
        ) : !getServiceOrderAdvancesResponse ||
          !getServiceOrderAdvancesResponse.data ? null : !getServiceOrderAdvancesResponse.data ||
          (getServiceOrderAdvancesResponse.data as AdvanceModel[])?.length ===
            0 ? (
          <p>No hay avances para esta orden de servicio</p>
        ) : (
          <div>
            {(getServiceOrderAdvancesResponse.data as AdvanceModel[]).map(
              (advance) => (
                <div
                  className="w-full h-full flex flex-col gap-2 mb-5"
                  key={advance.id}
                >
                  <p className="font-semibold">{advance.description}</p>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    {(advance.advance_images as string[])?.map(
                      (image: string, index: number) => (
                        <img
                          key={`${advance.id}-${index}`}
                          className="h-full m-auto"
                          src={`${
                            import.meta.env.VITE_API_BASE_ROUTE + "/"
                          }${image}`}
                        />
                      )
                    ) || <p>No hay imágenes</p>}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
