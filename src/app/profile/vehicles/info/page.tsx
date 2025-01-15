import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVehicleApiServices } from "../../../api/vehicles";
import { usePersistedStore } from "../../../../store/store";
import { Spinner } from "@nextui-org/react";
import VehicleInfo from "../../../../entities/vehicle/components/info";
import VehicleModel from "../../../../entities/vehicle/model";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";

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
    text: "Información de vehículo",
    url: "/profile/vehicles/info",
  },
];

export default function VehicleInfoPage() {
  const params = useParams();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  setBreadcrumbs(BreadCrumbsItems);

  const { token } = usePersistedStore().authReducer;

  const { getVehicleResponse, isGettingVehicle, perform } =
    useVehicleApiServices.getVehicle();

  useEffect(() => {
    if (!getVehicleResponse) perform(parseInt(params.id!), token!);
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {isGettingVehicle ? (
        <Spinner />
      ) : !getVehicleResponse ? null : (
        <VehicleInfo
          vehicle={getVehicleResponse?.data as VehicleModel}
          dataCommingFrom="server"
        />
      )}
    </div>
  );
}
