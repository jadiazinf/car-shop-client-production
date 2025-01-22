import { useContext, useEffect, useState } from "react";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import CompanyInfo from "../../../../entities/company/components/info";
import { useCompanyApiServices } from "../../../api/companies";
import { useNavigate, useParams } from "react-router-dom";
import { usePersistedStore } from "../../../../store/store";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { StatusCodes } from "http-status-codes";
import CompanyModel from "../../../../entities/company/model";
import ServiceModel from "../../../../entities/service/model";
import ButtonComponent from "../../../../components/buttons/component";
import ServicePricesComponent from "../../../../entities/service/components/prices/component";
import { AuthStatus } from "../../../../auth/types";
import { ToasterContext } from "../../../../components/toaster/context/context";
import LogoComponent from "../../../../components/logo/component";
import { ChooseCarForQuoteAndConfirm } from "./components/choose_car_for_quote";
import VehicleModel from "../../../../entities/vehicle/model";
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
];

export default function CompanyInfoForClient() {
  const { status } = usePersistedStore().authReducer;

  const navigate = useNavigate();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [page, _] = useState<number>(1);

  const [askForQuote, setAskForQuote] = useState<boolean>(false);

  const [selectedServicesForQuote, setSelectedServicesForQuote] = useState<
    ServiceModel[]
  >([]);

  const {
    perform: getCompany,
    isGettingCompany,
    getCompanyResponse,
  } = useCompanyApiServices.getCompany();

  const {
    getCompanyServicesResponse,
    isGettingCompanyServices,
    perform: performGetCompanyServices,
  } = useCompanyApiServices.getCompanyServices();

  const params = useParams();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    isOpen: isConfirmQuoteOpen,
    onOpen: onConfirmQuoteOpen,
    onOpenChange: onConfirmQuoteOpenChange,
  } = useDisclosure();

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(
    null
  );

  useEffect(() => {
    setBreadcrumbs(BreadCrumbsItems);
    getCompany(parseInt(params.id!));
  }, []);

  useEffect(() => {
    if (getCompanyResponse) {
      if (getCompanyResponse.status === StatusCodes.OK) {
        performGetCompanyServices(
          (getCompanyResponse.data! as CompanyModel).id!,
          page
        );
      }
    }
  }, [getCompanyResponse]);

  function handleSelectedService(service: ServiceModel) {
    const isSelected = selectedServicesForQuote.some(
      (element) => element.id === service.id!
    );
    if (isSelected)
      setSelectedServicesForQuote(
        selectedServicesForQuote.filter((element) => element.id !== service.id)
      );
    else setSelectedServicesForQuote([...selectedServicesForQuote, service]);
  }

  function isServiceSelected(service: ServiceModel) {
    return selectedServicesForQuote.some(
      (element) => element.id === service.id!
    );
  }

  function handleAskForQuoteButtonAction() {
    if (status === AuthStatus.NOT_AUTHENTICATED) {
      toasterDispatch({
        payload:
          "Para poder pedir presupuesto debe de registrarse o iniciar sesión",
        type: "INFO",
      });
      navigate("/auth");
      return;
    } else {
      setAskForQuote(!askForQuote);
    }
  }

  function handleMakeQuote() {
    if (status === AuthStatus.NOT_AUTHENTICATED) {
      toasterDispatch({
        payload:
          "Para poder pedir presupuesto debe de registrarse o iniciar sesión",
        type: "INFO",
      });
      navigate("/auth");
      return;
    } else {
      onOpen();
    }
  }

  function handleConfirmVehicle(vehicle: VehicleModel) {
    setSelectedVehicle(vehicle);
    onClose();
    onConfirmQuoteOpen();
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="sm"
        className="p-10"
        size="5xl"
      >
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col">
              <div className="w-full flex justify-center">
                <LogoComponent size="lg" />
              </div>
              <div className="mt-5">
                <ChooseCarForQuoteAndConfirm
                  onHandleConfirm={handleConfirmVehicle}
                />
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={isConfirmQuoteOpen}
        onOpenChange={onConfirmQuoteOpenChange}
        radius="sm"
        className="p-10"
        size="2xl"
      >
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col">
              <div className="w-full flex justify-center">
                <LogoComponent size="lg" />
              </div>
              <div className="mt-5">
                <ConfirmQuoteComponent
                  services={selectedServicesForQuote}
                  vehicle={selectedVehicle!}
                />
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full flex justify-center items-center flex-col">
        {isGettingCompany ? (
          <Spinner />
        ) : !getCompanyResponse ? (
          <p>No hay data que mostrar</p>
        ) : getCompanyResponse.status !== StatusCodes.OK ? (
          <p>{(getCompanyResponse.data as { errors: string[] }).errors[0]}</p>
        ) : (
          <>
            <CompanyInfo
              company={getCompanyResponse.data as CompanyModel}
              imagesAreCommingFrom="server"
              showChangeAvatar={false}
              showCharter={false}
            />
            <div className="w-full flex flex-col mt-10">
              <div className="flex items-center mb-5 flex-col gap-2 md:flex-row md:gap-5">
                <p className="font-semibold text-2xl font-inter">
                  Servicios que ofrece el taller
                </p>
                {!getCompanyServicesResponse ? null : getCompanyServicesResponse
                    .data?.data.length === 0 ? null : (
                  <div>
                    <Button
                      size="md"
                      variant="light"
                      color="primary"
                      onClick={handleAskForQuoteButtonAction}
                    >
                      {askForQuote
                        ? "No voy a pedir presupuesto"
                        : "Seleccionar servicios para pedir presupuesto"}
                    </Button>
                  </div>
                )}
              </div>
              {isGettingCompanyServices ? (
                <Spinner />
              ) : !getCompanyServicesResponse ? null : getCompanyServicesResponse
                  .data?.data.length === 0 ? (
                <div className="w-full">
                  <p className="text-black text-opacity-70">
                    Esta empresa no está ofreciendo servicios
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <div className="w-full flex flex-col gap-3">
                    {getCompanyServicesResponse.data?.data.map(
                      (element, index) => (
                        <div
                          key={index}
                          className={`w-full rounded-md border-black border-1.5 p-1.5 border-opacity-20 flex items-center ${
                            askForQuote &&
                            isServiceSelected(element) &&
                            "border-primary border-opacity-100"
                          }`}
                        >
                          {askForQuote && (
                            <div className="p-2">
                              <Checkbox
                                isSelected={isServiceSelected(element)}
                                onValueChange={() =>
                                  handleSelectedService(element)
                                }
                                radius="sm"
                              />
                            </div>
                          )}
                          <div className="flex flex-col w-full">
                            <div className="flex md:gap-2 items-center flex-col md:flex-row">
                              <p className="font-semibold">{element.name}</p>
                              <p className="text-black text-sm text-opacity-70">{`(${element.category?.name})`}</p>
                            </div>
                            <div className="w-full flex justify-between flex-col md:flex-row mt-2 md:mt-0">
                              <p className="text-black text-opacity-70 text-sm">
                                {element.description}
                              </p>
                              <div className="full flex gap-2 justify-end mt-2 md:mt-0">
                                <p className="text-sm">Costo: </p>
                                <ServicePricesComponent service={element} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="w-full flex justify-end">
                    {/* pagination component */}
                  </div>
                  <div className="w-full flex justify-end mb-10">
                    {askForQuote && (
                      <div className="w-auto mt-5">
                        <ButtonComponent
                          color="primary"
                          text="Confirmar"
                          type="button"
                          variant="solid"
                          isLoading={false}
                          onClick={handleMakeQuote}
                          isDisabled={!(selectedServicesForQuote.length > 0)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
