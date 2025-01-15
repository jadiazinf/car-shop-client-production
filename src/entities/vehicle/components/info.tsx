import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import ViewImagesComponent from "../../../components/images/view_images";
import VehicleModel from "../model";
import ButtonComponent from "../../../components/buttons/component";

function VehicleInfo(props: {
  vehicle: VehicleModel;
  isUpdatable?: boolean;
  dataCommingFrom: "client" | "server";
}) {
  const {
    isOpen: isShowImagesOpen,
    onOpen: onShowImagesOpen,
    onOpenChange: onShowImagesOpenChange,
  } = useDisclosure();

  function getViewImagesProps(
    vehicleImages: Blob[] | File[] | string[] | undefined
  ) {
    if (Array.isArray(vehicleImages) && vehicleImages.length > 0) {
      if (typeof vehicleImages[0] === "string") {
        return { images_urls: vehicleImages as string[] };
      } else {
        return { images: vehicleImages as File[] };
      }
    }
    return {};
  }

  return (
    <>
      <Modal
        isOpen={isShowImagesOpen}
        onOpenChange={onShowImagesOpenChange}
        size="2xl"
        radius="sm"
      >
        <ModalBody>
          <ModalContent>
            <div className="py-10">
              <ViewImagesComponent
                {...getViewImagesProps(props.vehicle.vehicle_images)}
                isCommingFrom={props.dataCommingFrom}
              />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
        <span className="font-bold text-lg mb-3">Información del vehículo</span>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Marca</p>
              <p className="font-medium">{props.vehicle.model?.brand?.name}</p>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Modelo</p>
              <p className="font-medium">{props.vehicle.model?.name}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Color</p>
              <p className="font-medium">{props.vehicle.color}</p>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Placa</p>
              <p className="font-medium">{props.vehicle.license_plate}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Año</p>
              <p className="font-medium">{props.vehicle.year}</p>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Número de ejes</p>
              <p className="font-medium">{props.vehicle.axles}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Cantidad de ruedas</p>
              <p className="font-medium">{props.vehicle.tires}</p>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Tipo de vehículo</p>
              <p className="font-medium">{props.vehicle.vehicle_type}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Transmisión</p>
              <p className="font-medium">{props.vehicle.transmission}</p>
            </div>
          </div>
        </div>
        {props.vehicle.vehicle_images && (
          <div className="mt-5 flex">
            <div className="w-auto">
              <ButtonComponent
                color="primary"
                text="Ver imágenes del vehículo"
                type="button"
                variant="light"
                onClick={onShowImagesOpen}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default VehicleInfo;
