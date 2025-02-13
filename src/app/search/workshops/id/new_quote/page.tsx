import { useParams } from "react-router-dom";
import { useCompanyApiServices } from "../../../../api/companies";
import { useContext, useEffect, useState } from "react";
import CompanyInfo from "../../../../../entities/company/components/info";
import { BreadcrumbItem, Breadcrumbs, Spinner } from "@nextui-org/react";
import CompanyModel from "../../../../../entities/company/model";
import { ChooseCarForQuoteComponent } from "./components/choose_car";
import VehicleModel from "../../../../../entities/vehicle/model";
import { ChooseServicesForQuote } from "./components/choose_services";
import { ServiceOrderModel } from "../../../../../entities/service_order/model";
import ButtonComponent from "../../../../../components/buttons/component";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import { ConfirmQuoteComponent } from "./components/confirm_quote";

const BreadCrumbsItems: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Búsqueda de taller",
    url: "/search/workshops",
  },
  {
    text: "Información de taller",
    url: "/search/workshops",
  },
  {
    text: "Nueva cotización",
    url: "/search/workshops/id/new_quote",
  },
];

type Stage =
  | "company_info"
  | "select_user_vehicle"
  | "select_company_services"
  | "confirm_quote";

export default function NewQuotePage() {
  const { id: company_id } = useParams();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [stage, setStage] = useState<Stage>("company_info");

  const {
    getCompanyResponse,
    isGettingCompany,
    perform: getCompany,
  } = useCompanyApiServices.getCompany();

  const [selectedVehicle, setSelectedVehicle] = useState<
    VehicleModel | undefined
  >(undefined);

  const [vehicleMileage, setVehicleMileage] = useState<number>(0.0);

  const [selectedServicesOrders, setSelectedServicesOrders] = useState<
    ServiceOrderModel[]
  >([]);

  useEffect(() => {
    setBreadcrumbs(BreadCrumbsItems);
    getCompany(parseInt(company_id!));
  }, []);

  function moveStage(movement: "previous" | "forward") {
    if (movement === "forward") {
      if (stage === "company_info") setStage("select_user_vehicle");
      else if (stage === "select_user_vehicle")
        setStage("select_company_services");
      else if (stage === "select_company_services") setStage("confirm_quote");
    } else {
      if (stage === "select_user_vehicle") setStage("company_info");
      else if (stage === "select_company_services")
        setStage("select_user_vehicle");
      else if (stage === "confirm_quote") setStage("select_company_services");
    }
  }

  function isNextButtonDisabled() {
    if (stage === "select_user_vehicle") return selectedVehicle === undefined;

    if (stage === "select_company_services")
      return selectedServicesOrders.length === 0;

    return false;
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        <Breadcrumbs
          underline="active"
          onAction={(key) => setStage(key as Stage)}
          className="mb-5"
        >
          {[
            { key: "company_info", label: "Información de compañía" },
            { key: "select_user_vehicle", label: "Seleccionar vehículo" },
            { key: "select_company_services", label: "Seleccionar servicios" },
            { key: "confirm_quote", label: "Confirmar cotización" },
          ].map((item) => (
            <BreadcrumbItem key={item.key} isCurrent={item.key === stage}>
              {item.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      </div>
      {isGettingCompany ? (
        <Spinner />
      ) : !getCompanyResponse || !getCompanyResponse.data ? null : (
        <div className="w-full h-full">
          {stage === "company_info" ? (
            <div className="w-full flex flex-col gap-2">
              <p className="font-semibold text-2xl">Información de compañía</p>
              <CompanyInfo
                company={getCompanyResponse!.data as CompanyModel}
                showChangeAvatar={false}
              />
            </div>
          ) : stage === "select_user_vehicle" ? (
            <ChooseCarForQuoteComponent
              selectedCar={selectedVehicle}
              setSelectedCar={setSelectedVehicle}
              setVehicleMileage={setVehicleMileage}
              onConfirm={() => moveStage("forward")}
            />
          ) : stage === "select_company_services" ? (
            <ChooseServicesForQuote
              vehicle_type={selectedVehicle!.vehicle_type}
              company_id={parseInt(company_id!)}
              selectedServicesOrders={selectedServicesOrders}
              setSelectedServicesOrders={setSelectedServicesOrders}
            />
          ) : stage === "confirm_quote" ? (
            <ConfirmQuoteComponent
              selectedServicesOrders={selectedServicesOrders}
              vehicle_mileage={vehicleMileage}
              selectedVehicle={selectedVehicle!}
              selectedCompany={getCompanyResponse!.data as CompanyModel}
            />
          ) : null}
          <div className="w-full flex justify-end mt-5 mb-10 gap-3">
            {stage !== "company_info" && (
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  variant="bordered"
                  text="Regresar"
                  type="button"
                  onClick={() => moveStage("previous")}
                />
              </div>
            )}
            {stage !== "confirm_quote" && (
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  variant="solid"
                  text="Siguiente"
                  type="button"
                  onClick={() => moveStage("forward")}
                  isDisabled={isNextButtonDisabled()}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
