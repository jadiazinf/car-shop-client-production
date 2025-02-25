import { StatusCodes } from "http-status-codes";
import VehicleInfoForm from "../../../../entities/vehicle/components/forms/vehicle/component";
import VehicleModel from "../../../../entities/vehicle/model";
import { usePersistedStore } from "../../../../store/store";
import { useVehicleApiServices } from "../../../api/vehicles";
import { useContext } from "react";
import { ToasterContext } from "../../../../components/toaster/context/context";
import ButtonComponent from "../../../../components/buttons/component";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import { Card, CardBody } from "@heroui/react";
import BrandAndModelProvider from "../../../../entities/model/providers/brand_and_model";
import VehicleProvider from "../../../../entities/vehicle/providers/vehicle";
import BrandAndModelContext from "../../../../entities/model/contexts/brand_and_model";

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
  {
    text: "Nuevo vehículo",
    url: "/profile/vehicles/new",
  },
];

function Main() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  setBreadcrumbs(BreadCrumbsItems);

  const { brandAndModel } = useContext(BrandAndModelContext);

  const { sessionType, token } = usePersistedStore().authReducer;

  const { dispatch } = useContext(ToasterContext);

  const { isCreatingVehicle, perform } = useVehicleApiServices.createVehicle();

  const { isAttachingImages, perform: attachImages } =
    useVehicleApiServices.attachImages();

  async function submit(vehicle: VehicleModel) {
    const response = await perform(
      { ...vehicle, model_id: brandAndModel!.model!.id! },
      token!,
      sessionType!.user!.id!
    );
    if (response.status === StatusCodes.CREATED) {
      dispatch({
        payload: "Vehículo registrado correctamente",
        type: "SUCCESS",
      });

      const attachImagesResponse = await attachImages(
        (response.data as VehicleModel).id!,
        vehicle.vehicle_images as File[],
        token!
      );

      if (attachImagesResponse.status === StatusCodes.OK) {
        window.location.href = "/profile/vehicles";
        return;
      } else {
        dispatch({
          payload:
            (response.data as { errors: string[] }).errors[0] ||
            "Vehículo registrado, per no se pudo registrar las imágenes del vehículo",
          type: "ERROR",
        });
      }
    }

    dispatch({
      payload:
        (response.data as { errors: string[] }).errors[0] ||
        "No se pudo registrar el vehículo",
      type: "ERROR",
    });
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Card radius="sm" className="px-10 py-5 w-full lg:w-2/3">
        <CardBody>
          <div className="mb-5">
            <span className="font-inter font-bold text-2xl">
              Formulario de registro de vehículo
            </span>
            <div className="hidden md:block md:w-1/6 bg-blue-600 h-1"></div>
          </div>
          <VehicleInfoForm initialValues={{} as VehicleModel} onSubmit={submit}>
            <div className="w-full flex justify-end">
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Registrar vehículo"
                  type="submit"
                  variant="solid"
                  isLoading={isCreatingVehicle || isAttachingImages}
                />
              </div>
            </div>
          </VehicleInfoForm>
        </CardBody>
      </Card>
    </div>
  );
}

export default function CreateVehicle() {
  return (
    <BrandAndModelProvider>
      <VehicleProvider>
        <Main />
      </VehicleProvider>
    </BrandAndModelProvider>
  );
}
