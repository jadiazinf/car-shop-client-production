import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import DatesHelpers from "../../../../helpers/dates/helper";
import { QuoteHelpers } from "../../helpers";
import { QuoteModel, QuoteStatus } from "../../model";
import { VehicleHelpers } from "../../../vehicle/helpers";
import { useQuoteApiServices } from "../../../../app/api/quotes";
import { useContext, useEffect, useState } from "react";
import { usePersistedStore } from "../../../../store/store";
import { FaRegEdit } from "react-icons/fa";
import LogoComponent from "../../../../components/logo/component";
import TextComponent from "../../../../components/inputs/text";
import ButtonComponent from "../../../../components/buttons/component";
import { NumberInputHelper } from "../../../../components/inputs/helpers";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../../components/toaster/context/context";

type Props = {
  quote: QuoteModel;
  refetch: (quote_id: number, token: string) => Promise<void>;
};

export function QuoteInfoForAdminComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const { getServicesResponse, isGettingQuoteServices, perform } =
    useQuoteApiServices.getServices();

  const { isUpdatingQuote, perform: updateQuote } =
    useQuoteApiServices.updateQuote();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const [selected, setSelected] = useState<
    "quote_info" | "client_info" | "vehicle_info" | "services_info"
  >("quote_info");

  const {
    isOpen: isUpdateNoteOpen,
    onOpenChange: onUpdateNoteOpenChange,
    onOpen: onUpdateNoteOpen,
  } = useDisclosure();

  const {
    isOpen: isUpdateTotalCostOpen,
    onOpenChange: onUpdateTotalCostOpenChange,
    onOpen: onUpdateTotalCostOpen,
  } = useDisclosure();

  const [totalCost, setTotalCost] = useState<string>("0.00");

  const [note, setNote] = useState<string>("");

  useEffect(() => {
    perform(props.quote.id!, token!);
  }, []);

  function handleTotalCostChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, totalCost as string);
    setTotalCost(value);
  }

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setNote(e.target.value);
  }

  async function handleUpdateNote() {
    const response = await updateQuote(
      { id: props.quote.id, note } as QuoteModel,
      token!
    );
    if (response.status === StatusCodes.OK) {
      toasterDispatch({
        payload: "Cotización actualizada correctamente",
        type: "SUCCESS",
      });
      props.refetch(props.quote.id!, token!);
    } else {
      toasterDispatch({
        payload:
          response.data?.errors?.[0] || "Cotización no se pudo actualizar",
        type: "ERROR",
      });
    }
  }

  async function handleUpdateTotalCost() {
    const response = await updateQuote(
      { id: props.quote.id, total_cost: parseFloat(totalCost) } as QuoteModel,
      token!
    );
    if (response.status === StatusCodes.OK) {
      toasterDispatch({
        payload: "Cotización actualizada correctamente",
        type: "SUCCESS",
      });
      props.refetch(props.quote.id!, token!);
    } else {
      toasterDispatch({
        payload:
          response.data?.errors?.[0] || "Cotización no se pudo actualizar",
        type: "ERROR",
      });
    }
  }

  return (
    <>
      <Modal
        className="p-5"
        radius="sm"
        size="xl"
        isOpen={isUpdateTotalCostOpen}
        onOpenChange={onUpdateTotalCostOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col gap-5 justify-center items-center">
              <LogoComponent />
              <p>Actualizar precio de la cotización</p>
              <div className="w-auto">
                <TextComponent
                  onKeyDown={handleTotalCostChange}
                  name="total_cost"
                  type="text"
                  value={totalCost}
                  label="Costo total de la cotización"
                />
                <div className="mt-5">
                  <ButtonComponent
                    text="Actualizar precio"
                    onClick={handleUpdateTotalCost}
                    color="primary"
                    type="button"
                    variant="solid"
                    isLoading={isUpdatingQuote}
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
        size="xl"
        isOpen={isUpdateNoteOpen}
        onOpenChange={onUpdateNoteOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col gap-5 justify-center items-center">
              <LogoComponent />
              <p>Actualizar nota</p>
              <div className="w-auto">
                <TextComponent
                  name="note"
                  type="text"
                  value={note}
                  label="Nota para la cotización"
                  onChange={handleNoteChange}
                />
                <div className="mt-5">
                  <ButtonComponent
                    text="Actualizar nota"
                    onClick={handleUpdateNote}
                    color="primary"
                    type="button"
                    variant="solid"
                    isLoading={isUpdatingQuote}
                  />
                </div>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <Tabs
        className="w-full"
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(value) => setSelected(value as any)}
        variant="underlined"
      >
        <Tab key="quote_info" title="Información de la cotización">
          <div className="w-full h-full p-5 border-1.5 rounded-md border-opacity-50 flex flex-col gap-10">
            <p className="font-inter font-semibold text-2xl">
              Información de cotización
            </p>
            <div className="w-full flex flex-col md:flex-row gap-5">
              <div className="w-full items-center">
                <p className="font-semibold font-inter">Fecha de creación</p>
                <p>{DatesHelpers.formatFullDate(props.quote.date as string)}</p>
              </div>
              <div className="w-full items-center">
                <div className="flex items-center gap-2">
                  <p className="font-semibold font-inter">
                    Costo de la cotización
                  </p>
                  {props.quote.status_by_company === QuoteStatus.PENDING && (
                    <FaRegEdit
                      className="text-black text-opacity-50 cursor-pointer w-4 h-4 hover:text-opacity-100 transition-all ease-in-out duration-300"
                      onClick={onUpdateTotalCostOpen}
                    />
                  )}
                </div>
                <p>{`${props.quote.total_cost} REF`}</p>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-5">
              <div className="w-full items-center">
                <p className="font-semibold font-inter">
                  Estado de la cotización por parte del cliente
                </p>
                <p>{`${QuoteHelpers.translateQuoteStatus(
                  props.quote.status_by_client
                )}`}</p>
              </div>
              <div className="w-full items-center">
                <p className="font-semibold font-inter">
                  Estado de la cotización por parte de la empresa
                </p>
                <p>{`${QuoteHelpers.translateQuoteStatus(
                  props.quote.status_by_company
                )}`}</p>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-5">
              <div className="w-full items-center">
                <div className="flex items-center gap-2">
                  <p className="font-semibold font-inter">Nota</p>
                  {props.quote.status_by_company === QuoteStatus.PENDING && (
                    <FaRegEdit
                      className="text-black text-opacity-50 cursor-pointer w-4 h-4 hover:text-opacity-100 transition-all ease-in-out duration-300"
                      onClick={onUpdateNoteOpen}
                    />
                  )}
                </div>
                <p>{props.quote.note || "Sin nota"}</p>
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="client_info" title="Información del cliente">
          <p className="font-semibold font-inter text-2xl mb-3">
            Información del cliente
          </p>
          <div className="w-full h-full p-5 border-1.5 rounded-md border-opacity-50 flex flex-col gap-10">
            <div className="w-full flex flex-col md:flex-row gap-5">
              <div className="w-full items-center">
                <p className="font-semibold font-inter">Nombre</p>
                <p>{`${props.quote.vehicle?.user?.first_name} ${props.quote.vehicle?.user?.last_name}`}</p>
              </div>
              <div className="w-full items-center">
                <p className="font-semibold font-inter">Cédula</p>
                <p>{props.quote.vehicle?.user?.dni}</p>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-5">
              <div className="w-full items-center">
                <p className="font-semibold font-inter">Correo electrónico</p>
                <p>{props.quote.vehicle?.user?.email || ""}</p>
              </div>
              <div className="w-full items-center">
                <p className="font-semibold font-inter">Número de teléfono</p>
                <p>{props.quote.vehicle?.user?.phone_number}</p>
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="vehicle_info" title="Información del vehículo">
          <p className="font-semibold font-inter text-2xl mb-3">
            Información del vehículo
          </p>
          <div className="w-full h-full p-5 border-1.5 rounded-md border-opacity-50 flex flex-col gap-10">
            <div className="w-full flex flex-col md:flex-row gap-5">
              <div className="w-full items-center">
                <p className="font-semibold font-inter">Marca</p>
                <p>{props.quote.vehicle?.model?.brand?.name}</p>
              </div>
              <div className="w-full items-center">
                <p className="font-semibold font-inter">Tipo de vehículo</p>
                <p>
                  {VehicleHelpers.translateVehicleType(
                    props.quote.vehicle?.vehicle_type!
                  )}
                </p>
              </div>
              <div className="w-full items-center">
                <p className="font-semibold font-inter">Placa</p>
                <p>{props.quote.vehicle?.license_plate}</p>
              </div>
            </div>
          </div>
        </Tab>
        <Tab key="services_info" title="Servicios">
          <p className="font-semibold font-inter text-2xl mb-3">
            Lista de servicios
          </p>
          <div className="w-full p-5 justify-center items-center">
            {!getServicesResponse ||
            !getServicesResponse.data ? null : isGettingQuoteServices ? (
              <Spinner />
            ) : (
              getServicesResponse.data.map((service, index) => (
                <div className="w-full" key={index}>
                  <div className="w-full grid grid-cols-3 gap-2">
                    <p>{service.name}</p>
                    <p>{service.category!.name}</p>
                    <p>{service.description}</p>
                  </div>
                  <Divider className="my-2" />
                </div>
              ))
            )}
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
