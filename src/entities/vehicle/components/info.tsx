import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import ViewImagesComponent from "../../../components/images/view_images";
import VehicleModel from "../model";
import ButtonComponent from "../../../components/buttons/component";
import { FaRegEdit } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import SelectBrandAndModelComponent from "../../model/components/select_brand_and_model";
import BrandAndModelContext from "../../model/contexts/brand_and_model";
import BrandAndModelProvider from "../../model/providers/brand_and_model";
import { BrandAndModel } from '../../model/types';
import LogoComponent from "../../../components/logo/component";
import { useNavigate } from "react-router-dom";
import { useVehicleApiServices } from "../../../app/api/vehicles";
import { usePersistedStore } from "../../../store/store";
import { ToasterContext } from "../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import { VehicleHelpers } from '../helpers';
import { Color, VEHICLE_COLORS } from "../../../consts/colors";
import SelectComponent from "../../../components/inputs/select";
import DatesHelpers from "../../../helpers/dates/helper";
import { VEHICLE_TRANSMISSION_ARR, VEHICLE_TYPES_ARR, VehicleTransmission, VehicleType } from "../types";

type Props = {
  vehicle: VehicleModel;
  isUpdatable?: boolean;
  dataCommingFrom: "client" | "server";
}

function VehicleInfo(props: Props) {
  return (
    <BrandAndModelProvider>
      <Main dataCommingFrom={props.dataCommingFrom} vehicle={props.vehicle} isUpdatable={props.isUpdatable}/>
    </BrandAndModelProvider>
  );
}

function Main(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const {
    isOpen: isShowImagesOpen,
    onOpen: onShowImagesOpen,
    onOpenChange: onShowImagesOpenChange,
  } = useDisclosure();

  const {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
  } = useDisclosure();

  const [updateElement, setUpdateElement] = useState<JSX.Element | null>(null);

  const { isUpdatingVehicle, perform } = useVehicleApiServices.updateVehicle();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (updateElement && !isOpen) onOpen();
  }, [updateElement]);

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

  async function onUpdate(values: Partial<VehicleModel>) {
    const response = await perform({...values, id: props.vehicle.id!}, token!);
    if (response.status === StatusCodes.OK) {
      toasterDispatch({payload: "Información del vehículo actualizada correctamente", type: "SUCCESS"});
      navigate(0);
    } else {
      toasterDispatch({payload: "Error al actualizar la información del vehículo", type: "ERROR"});
    }
    setUpdateElement(null);
    onClose();
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
                images={props.vehicle.vehicle_images!}
                isCommingFrom={props.dataCommingFrom}
              />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        radius="sm"
      >
        <ModalBody>
          <ModalContent>
            <div className="p-10 flex flex-col justify-center items-center">
              <LogoComponent />
              <div className="mt-5">
                { updateElement }
              </div>
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
              <div className="flex items-center gap-3">
                <p className="font-medium">{props.vehicle.model?.brand?.name}</p>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Modelo</p>
              <div className="flex items-center gap-3">
                <p className="font-medium">{props.vehicle.model?.name}</p>
                {props.isUpdatable && (
                  <FaRegEdit
                    className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                    onClick={() =>
                      setUpdateElement(
                        <UpdateBrandAndModel
                          isLoading={isUpdatingVehicle}
                          vehicleInfo={props.vehicle}
                          updateAction={(value) => onUpdate({model_id: value.model!.id})}
                        />
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Color</p>
              <div className="flex items-center gap-3">
                <p className="font-medium">{VehicleHelpers.translateVehicleColor(props.vehicle.color)}</p>
                {props.isUpdatable && (
                  <FaRegEdit
                    className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                    onClick={() =>
                      setUpdateElement(
                        <UpdateColor
                          isLoading={isUpdatingVehicle}
                          vehicleInfo={props.vehicle}
                          updateAction={(value) => onUpdate({color: value})}
                        />
                      )
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Placa</p>
              <div className="flex items-center gap-3">
                <p className="font-medium">{props.vehicle.license_plate}</p>
                {props.isUpdatable && (
                  <FaRegEdit
                    className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                    onClick={() =>
                      setUpdateElement(
                        <UpdateLicensePlate
                          isLoading={isUpdatingVehicle}
                          vehicleInfo={props.vehicle}
                          updateAction={(value) => onUpdate({license_plate: value})}
                        />
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Año</p>
              <div className="flex items-center gap-3">
                <p className="font-medium">{props.vehicle.year}</p>
                {props.isUpdatable && (
                  <FaRegEdit
                    className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                    onClick={() =>
                      setUpdateElement(
                        <UpdateYear
                          isLoading={isUpdatingVehicle}
                          vehicleInfo={props.vehicle}
                          updateAction={(value) => onUpdate({year: value})}
                        />
                      )
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Número de ejes</p>
              <div className="flex items-center gap-3">
                <p className="font-medium">{props.vehicle.axles}</p>
                {props.isUpdatable && (
                  <FaRegEdit
                    className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                    onClick={() =>
                      setUpdateElement(
                        <UpdateAxles
                          isLoading={isUpdatingVehicle}
                          vehicleInfo={props.vehicle}
                          updateAction={(value) => onUpdate({axles: value})}
                        />
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Cantidad de ruedas</p>
              <div className="flex items-center gap-3">
                <p className="font-medium">{props.vehicle.tires}</p>
                {props.isUpdatable && (
                  <FaRegEdit
                    className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                    onClick={() =>
                      setUpdateElement(
                        <UpdateTires
                          isLoading={isUpdatingVehicle}
                          vehicleInfo={props.vehicle}
                          updateAction={(value) => onUpdate({tires: value})}
                        />
                      )
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Tipo de vehículo</p>
              <div className="flex items-center gap-3">
                <p className="font-medium">{VehicleHelpers.translateVehicleType(props.vehicle.vehicle_type)}</p>
                {props.isUpdatable && (
                  <FaRegEdit
                    className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                    onClick={() =>
                      setUpdateElement(
                        <UpdateVehicleType
                          isLoading={isUpdatingVehicle}
                          vehicleInfo={props.vehicle}
                          updateAction={(value) => onUpdate({vehicle_type: value})}
                        />
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col w-full">
              <p className="font-light text-sm">Transmisión</p>
              <div className="flex items-center gap-3">
                <p className="font-medium">{VehicleHelpers.translateVehicleTransmission(props.vehicle.transmission)}</p>
                {props.isUpdatable && (
                  <FaRegEdit
                    className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                    onClick={() =>
                      setUpdateElement(
                        <UpdateVehicleTransmission
                          isLoading={isUpdatingVehicle}
                          vehicleInfo={props.vehicle}
                          updateAction={(value) => onUpdate({transmission: value})}
                        />
                      )
                    }
                  />
                )}
              </div>
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

function UpdateBrandAndModel(props: { vehicleInfo: VehicleModel, isLoading: boolean, updateAction: (value: BrandAndModel) => void }) {
  const { brandAndModel, setBrandAndModel } = useContext(BrandAndModelContext);

  useEffect(() => {
    setBrandAndModel({brand: props.vehicleInfo.model!.brand!, model: props.vehicleInfo.model!});
  }, []);

  function disableButton() {
    if (brandAndModel?.model) {
      if (brandAndModel.model!.id !== props.vehicleInfo.model!.id)
        return false;
    }

    return true;
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Seleccione modelo y marca para actualización</p>
      <SelectBrandAndModelComponent orientation="vertical"/>
      <Button
        variant="solid"
        color="primary"
        isDisabled={disableButton()}
        onPress={() => props.updateAction(brandAndModel!)}
        isLoading={props.isLoading}
        radius="sm"
      >
        Actualizar
      </Button>
    </div>
  );
}

function UpdateColor(props: { vehicleInfo: VehicleModel, isLoading: boolean, updateAction: (value: Color) => void }) {

  const [color, setColor] = useState<Color>(props.vehicleInfo.color);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Seleccione color para actualización</p>
      <Select
        label="Color"
        key="color"
        name="color"
        variant="bordered"
        radius="sm"
        onChange={(e) => setColor(e.target.value as Color)}
        value={color}
      >
        {
          VEHICLE_COLORS.map((element) => (
            <SelectItem key={element}>
              { VehicleHelpers.translateVehicleColor(element) }
            </SelectItem>
          ))
        }
      </Select>
      <Button
        variant="solid"
        color="primary"
        isDisabled={color === props.vehicleInfo.color}
        onPress={() => props.updateAction(color)}
        isLoading={props.isLoading}
        radius="sm"
      >
        Actualizar
      </Button>
    </div>
  );
}

function UpdateLicensePlate(props: { vehicleInfo: VehicleModel, isLoading: boolean, updateAction: (value: string) => void }) {

  const [licensePlate, setLicensePlate] = useState<string>(props.vehicleInfo.license_plate);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Ingrese placa para actualización</p>
      <Input
        name="license_plate"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
        variant="bordered"
        radius="sm"
        label="Placa de vehículo"
      />
      <Button
        variant="solid"
        color="primary"
        isDisabled={licensePlate.length < 8 || licensePlate === props.vehicleInfo.license_plate}
        onPress={() => props.updateAction(licensePlate)}
        isLoading={props.isLoading}
        radius="sm"
      >
        Actualizar
      </Button>
    </div>
  );
}

function UpdateYear(props: { vehicleInfo: VehicleModel, isLoading: boolean, updateAction: (value: number) => void }) {

  const [year, setYear] = useState<number>(props.vehicleInfo.year)

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Ingrese año para actualización</p>
      <SelectComponent
        label="Año"
        data={DatesHelpers.getYearsDescending().map((year) => ({
          key: year.toString(),
          label: year.toString(),
        }))}
        key="year"
        name="year"
        onChange={(e) => setYear(parseInt(e.target.value))}
        value={year.toString()}
      />
      <Button
        variant="solid"
        color="primary"
        isDisabled={year === props.vehicleInfo.year}
        onPress={() => props.updateAction(year)}
        isLoading={props.isLoading}
        radius="sm"
      >
        Actualizar
      </Button>
    </div>
  );
}

function UpdateAxles(props: { vehicleInfo: VehicleModel, isLoading: boolean, updateAction: (value: number) => void }) {

  const [axles, setAxles] = useState<number>(props.vehicleInfo.axles)

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Ingrese cantidad de ejes para actualización</p>
      <SelectComponent
        label="Cantidad de ejes"
        data={[1, 2, 3, 4, 5, 6].map((element) => ({
          key: element.toString(),
          label: element.toString(),
        }))}
        key="year"
        name="year"
        onChange={(e) => setAxles(parseInt(e.target.value))}
        value={axles.toString()}
      />
      <Button
        variant="solid"
        color="primary"
        isDisabled={axles === props.vehicleInfo.axles}
        onPress={() => props.updateAction(axles)}
        isLoading={props.isLoading}
        radius="sm"
      >
        Actualizar
      </Button>
    </div>
  );
}

function UpdateTires(props: { vehicleInfo: VehicleModel, isLoading: boolean, updateAction: (value: number) => void }) {

  const [tires, setTires] = useState<number>(props.vehicleInfo.tires)

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Ingrese cantidad de ruedas para actualización</p>
      <SelectComponent
        label="Cantidad de ejes"
        data={[1, 2, 3, 4, 5, 6].map((element) => ({
          key: element.toString(),
          label: element.toString(),
        }))}
        key="year"
        name="year"
        onChange={(e) => setTires(parseInt(e.target.value))}
        value={tires.toString()}
      />
      <Button
        variant="solid"
        color="primary"
        isDisabled={tires === props.vehicleInfo.tires}
        onPress={() => props.updateAction(tires)}
        isLoading={props.isLoading}
        radius="sm"
      >
        Actualizar
      </Button>
    </div>
  );
}

function UpdateVehicleType(props: { vehicleInfo: VehicleModel, isLoading: boolean, updateAction: (value: VehicleType) => void }) {

  const [vehicleType, setVehicleType] = useState<string>(props.vehicleInfo.vehicle_type)

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Ingrese tipo de vehículo para actualización</p>
      <SelectComponent
        label="Tipo de vehículo"
        data={VEHICLE_TYPES_ARR.map((type) => ({
          key: type.key,
          label: VehicleHelpers.translateVehicleType(type.key),
        }))}
        key="year"
        name="year"
        onChange={(e) => setVehicleType(e.target.value)}
        value={vehicleType}
      />
      <Button
        variant="solid"
        color="primary"
        isDisabled={vehicleType === props.vehicleInfo.vehicle_type}
        onPress={() => props.updateAction(vehicleType as VehicleType)}
        isLoading={props.isLoading}
        radius="sm"
      >
        Actualizar
      </Button>
    </div>
  );
}


function UpdateVehicleTransmission(props: { vehicleInfo: VehicleModel, isLoading: boolean, updateAction: (value: VehicleTransmission) => void }) {

  const [vehicleTransmission, setVehicleTransmission] = useState<VehicleTransmission>(props.vehicleInfo.transmission)

  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Ingrese tipo de vehículo para actualización</p>
      <SelectComponent
        label="Tipo de vehículo"
        data={VEHICLE_TRANSMISSION_ARR.map((type) => ({
          key: type.key,
          label: type.label,
        }))}
        key="year"
        name="year"
        onChange={(e) => setVehicleTransmission(e.target.value as VehicleTransmission)}
        value={vehicleTransmission}
      />
      <Button
        variant="solid"
        color="primary"
        isDisabled={vehicleTransmission === props.vehicleInfo.transmission}
        onPress={() => props.updateAction(vehicleTransmission)}
        isLoading={props.isLoading}
        radius="sm"
      >
        Actualizar
      </Button>
    </div>
  );
}

