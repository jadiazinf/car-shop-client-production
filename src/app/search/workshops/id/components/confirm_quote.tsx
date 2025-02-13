import { StatusCodes } from "http-status-codes";
import ButtonComponent from "../../../../../components/buttons/component";
import ServiceModel from "../../../../../entities/service/model";
import VehicleModel from "../../../../../entities/vehicle/model";
import { usePersistedStore } from "../../../../../store/store";
import { useContext } from "react";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { useNavigate } from "react-router-dom";
import { useOrderApiServices } from "../../../../api/orders";
import { OrderStatus } from "../../../../../entities/order/model";

type Props = {
  vehicle: VehicleModel;
  services: ServiceModel[];
};

export function ConfirmQuoteComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const { isCreatingOrder, perform } = useOrderApiServices.createOrder();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  async function handleCreateQuote() {
    const response = await perform(
      {
        is_checked: false,
        status: OrderStatus.QUOTE,
        vehicle_mileage: 0,
        company_id: props.services[0].company_id,
        is_active: true,
        service_orders: [],
        vehicle_id: props.vehicle.id!,
      },
      token!
    );

    if (response.status === StatusCodes.CREATED) {
      toasterDispatch({
        payload: "Cotización creada exitosamente",
        type: "SUCCESS",
      });
      navigate("/");
    } else {
      toasterDispatch({
        payload:
          (response.data as { errors: string[] }).errors[0] ||
          "Error al crear la cotización",
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
            isLoading={isCreatingOrder}
          />
        </div>
      </div>
    </div>
  );
}
