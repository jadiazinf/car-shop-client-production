import { Divider, Spinner, Tab, Tabs } from "@nextui-org/react";
import DatesHelpers from "../../../../helpers/dates/helper";
import { QuoteHelpers } from "../../helpers";
import { QuoteModel } from "../../model";
import { useQuoteApiServices } from "../../../../app/api/quotes";
import { useEffect, useState } from "react";
import { usePersistedStore } from "../../../../store/store";
import CompanyInfo from "../../../company/components/info";
import VehicleInfo from "../../../vehicle/components/info";

type Props = {
  quote: QuoteModel;
  refetch: (quote_id: number, token: string) => Promise<void>;
};

export function QuoteInfoForClientComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const { getServicesResponse, isGettingQuoteServices, perform } =
    useQuoteApiServices.getServices();

  const [selected, setSelected] = useState<
    "quote_info" | "company_info" | "vehicle_info" | "services_info"
  >("quote_info");

  useEffect(() => {
    perform(props.quote.id!, token!);
  }, []);

  return (
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
              </div>
              <p>{props.quote.note || "Sin nota"}</p>
            </div>
          </div>
        </div>
      </Tab>
      <Tab key="company_info" title="Información de la compañía">
        <p className="font-semibold font-inter text-2xl mb-3">
          Información de la compañía
        </p>
        <CompanyInfo
          company={props.quote.service!.company!}
          imagesAreCommingFrom="server"
          showChangeAvatar={false}
        />
      </Tab>
      <Tab key="vehicle_info" title="Información del vehículo">
        <p className="font-semibold font-inter text-2xl mb-3">
          Información del vehículo
        </p>
        <VehicleInfo
          dataCommingFrom="server"
          vehicle={props.quote.vehicle!}
          isUpdatable={false}
        />
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
  );
}
