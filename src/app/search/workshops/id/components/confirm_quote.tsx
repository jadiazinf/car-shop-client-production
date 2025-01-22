import { StatusCodes } from "http-status-codes";
import ButtonComponent from "../../../../../components/buttons/component";
import { QuoteModel, QuoteStatus } from "../../../../../entities/quote/model";
import ServiceModel from "../../../../../entities/service/model";
import VehicleModel from "../../../../../entities/vehicle/model";
import { VehicleType } from "../../../../../entities/vehicle/types";
import { usePersistedStore } from "../../../../../store/store";
import { useQuoteApiServices } from "../../../../api/quotes";
import { useContext } from "react";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { useNavigate } from "react-router-dom";

type Props = {
  vehicle: VehicleModel;
  services: ServiceModel[];
};

export function ConfirmQuoteComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const { isCreatingQuotes, perform } = useQuoteApiServices.createQuotes();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  function getQuoteTotalCost() {
    return props.services.reduce((acc, service) => {
      switch (props.vehicle.vehicle_type) {
        case VehicleType.CAR:
          return acc + ((service.price_for_car as number) || 0);
        case VehicleType.MOTORBIKE:
          return acc + ((service.price_for_motorbike as number) || 0);
        case VehicleType.TRUCK:
          return acc + ((service.price_for_truck as number) || 0);
        case VehicleType.VAN:
          return acc + ((service.price_for_van as number) || 0);
        default:
          return acc;
      }
    }, 0);
  }

  function buildQuote() {
    return props.services.map(
      (service) =>
        ({
          date: new Date(),
          status_by_client: QuoteStatus.APPROVED,
          status_by_company: QuoteStatus.PENDING,
          total_cost: getQuoteTotalCost(),
          note: "",
          vehicle_id: props.vehicle.id,
          service_id: service.id,
        } as QuoteModel)
    );
  }

  async function handleCreateQuote() {
    const response = await perform(buildQuote(), token!);
    if (response.status === StatusCodes.CREATED) {
      toasterDispatch({
        payload: "Cotización creada exitosamente",
        type: "SUCCESS",
      });
      navigate("/");
    } else {
      toasterDispatch({
        payload: response.data.message || "Error al crear la cotización",
        type: "ERROR",
      });
    }
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-3 overflow-y-auto h-1/2 mb-10">
        <p className="font-semibold text-2xl font-inter">
          Servicios seleccionados
        </p>
        {props.services.map((service, index) => (
          <div className="" key={index}>
            <div className="flex items-center gap-2">
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-black text-opacity-50">{`(${
                service.category!.name
              })`}</p>
            </div>
          </div>
        ))}
        <div className="flex flex-col">
          <p className="font-semibold text-2xl font-inter mt-5">
            Vehiculo seleccionado
          </p>
          <div className="flex gap-2 items-center">
            <p>{`${props.vehicle.model!.brand!.name} ${
              props.vehicle.model!.name
            }`}</p>
          </div>
          <p>{`Año ${props.vehicle.year}`}</p>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Confirmar y cotizar"
            type="button"
            variant="solid"
            onClick={handleCreateQuote}
            isLoading={isCreatingQuotes}
          />
        </div>
      </div>
    </div>
  );
}
