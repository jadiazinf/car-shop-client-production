import { useContext, useEffect, useState } from "react";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import { SearchUserForQuoteComponent } from "./components/search_user";
import { SelectUserVehicleForQuoteComponent } from "./components/select_user_vehicle";
import { ConfirmNewQuoteComponent } from "./components/confirm_quote";
import UserModel from "../../../../../entities/user/model";
import VehicleModel from "../../../../../entities/vehicle/model";
import ServiceModel from "../../../../../entities/service/model";
import { SelectServiceOrdersComponent } from "./components/select_service_orders";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { VehicleHelpers } from "../../../../../entities/vehicle/helpers";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
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
    text: "Cotizaciones",
    url: "/dashboard/services/quotes",
  },
  {
    text: "Nueva cotización",
    url: "/dashboard/services/quotes/new",
  },
];

export default function ServicesNewQuotePage() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [stage, setStage] = useState<
    "search_user" | "select_user_vehicle" | "select_services" | "confirm_quote"
  >("search_user");

  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(
    null
  );

  const [selectedServices, setSelectedServices] = useState<ServiceModel[]>([]);

  const [vehicleMileage, setVehicleMileage] = useState<number>(0);

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  function handleGoToUserVehicleSelection(user: UserModel) {
    setSelectedUser(user);
    setStage("select_user_vehicle");
  }

  return (
    <div className="w-full h-full">
      <div className="">
        <Breadcrumbs className="mb-5">
          {selectedUser && (
            <BreadcrumbItem
              isCurrent={stage === "search_user"}
              onClick={() => setStage("search_user")}
            >{`${selectedUser.first_name} ${selectedUser.last_name}`}</BreadcrumbItem>
          )}
          {selectedVehicle && (
            <BreadcrumbItem
              isCurrent={stage === "select_user_vehicle"}
              onClick={() => setStage("select_user_vehicle")}
            >{`${VehicleHelpers.translateVehicleType(
              selectedVehicle.vehicle_type
            )} (${selectedVehicle.license_plate})`}</BreadcrumbItem>
          )}
          {selectedServices.length > 0 && (
            <BreadcrumbItem
              isCurrent={stage === "select_services"}
              onClick={() => setStage("select_services")}
            >{`${selectedServices[0].name} ${
              selectedServices.length > 1 ? ", ..." : ""
            }`}</BreadcrumbItem>
          )}
          {stage === "confirm_quote" && (
            <BreadcrumbItem
              isCurrent={stage === "confirm_quote"}
              onClick={() => setStage("confirm_quote")}
            >
              Confirmar cotización
            </BreadcrumbItem>
          )}
        </Breadcrumbs>
        {stage === "search_user" && (
          <SearchUserForQuoteComponent
            onAction={handleGoToUserVehicleSelection}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        )}
        {stage === "select_user_vehicle" && (
          <SelectUserVehicleForQuoteComponent
            user_id={selectedUser!.id!}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            onPrevStep={() => setStage("search_user")}
            onNextStep={() => setStage("select_services")}
            setVehicleMileage={setVehicleMileage}
          />
        )}
        {stage === "select_services" && (
          <SelectServiceOrdersComponent
            vehicle_type={selectedVehicle!.vehicle_type}
            selectedServices={selectedServices}
            onSelectService={(services) => setSelectedServices(services)}
            onNextStep={() => setStage("confirm_quote")}
            onPrevStep={() => setStage("select_user_vehicle")}
          />
        )}
        {stage === "confirm_quote" && (
          <ConfirmNewQuoteComponent
            selectedServices={selectedServices}
            selectedUser={selectedUser!}
            selectedVehicle={selectedVehicle!}
            onPrevStep={() => setStage("select_user_vehicle")}
            vehicleMileage={vehicleMileage}
          />
        )}
      </div>
    </div>
  );
}
