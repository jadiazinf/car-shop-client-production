import { Divider } from "@nextui-org/react";
import ButtonComponent from "../../../../../../components/buttons/component";
import CompanyModel from "../../../../../../entities/company/model";
import {
  ServiceOrderModel,
  ServiceOrderStatus,
} from "../../../../../../entities/service_order/model";
import VehicleModel from "../../../../../../entities/vehicle/model";
import { useOrderApiServices } from "../../../../../api/orders";
import { usePersistedStore } from "../../../../../../store/store";
import { OrderStatus } from "../../../../../../entities/order/model";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { ToasterContext } from "../../../../../../components/toaster/context/context";
import { useNavigate } from "react-router-dom";

type Props = {
  vehicle_mileage: number;
  selectedCompany: CompanyModel;
  selectedVehicle: VehicleModel;
  selectedServicesOrders: ServiceOrderModel[];
};

export function ConfirmQuoteComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const { isCreatingOrder, perform: createOrder } =
    useOrderApiServices.createOrder();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  async function handleCreateOrder() {
    const response = await createOrder(
      {
        status: OrderStatus.QUOTE,
        vehicle_mileage: props.vehicle_mileage,
        is_active: true,
        is_checked: false,
        created_by: null,
        vehicle_id: props.selectedVehicle.id!,
        company_id: props.selectedCompany.id!,
        services_orders: props.selectedServicesOrders.map((service_order) => ({
          cost: service_order.cost,
          status: ServiceOrderStatus.PENDING_FOR_QUOTE_APPROVEMENT,
          service_id: service_order.service_id,
        })),
      },
      token!
    );

    if (response.status === StatusCodes.CREATED) {
      toasterDispatch({
        payload: "Cotización creada correctamente",
        type: "SUCCESS",
      });
      navigate("/");
      return;
    }

    toasterDispatch({
      payload:
        (response.data as { errors: string[] }).errors[0] ||
        "Error creando la cotización",
      type: "ERROR",
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border-black border-1.5 border-opacity-40 p-5 w-full rounded-md">
        <p className="font-semibold text-lg mb-5">Información de compañía</p>
        <div className="flex flex-col gap-3"></div>
        <div className="flex flex-col md:flex-row md:justify-between">
          <p>{props.selectedCompany.name}</p>
          <p>{`Número de teléfono: ${
            props.selectedCompany.phone_numbers!.length > 0
              ? props.selectedCompany.phone_numbers
              : "No registrado"
          }`}</p>
          <p>{`Correo electrónico: ${props.selectedCompany.email}`}</p>
        </div>
        <p>{`Dirección: ${props.selectedCompany.address}`}</p>
      </div>
      <div className="border-black border-1.5 border-opacity-40 p-5 w-full rounded-md">
        <p className="font-semibold text-lg mb-5">
          Información de vehículo seleccionado
        </p>
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <p>{props.selectedVehicle.model?.brand?.name}</p>
            <p>{props.selectedVehicle.model?.name}</p>
          </div>
          <p>{`Año: ${props.selectedVehicle.year}`}</p>
          <p>{`Licensia: ${props.selectedVehicle.license_plate}`}</p>
          <p>{`Kilometraje: ${props.vehicle_mileage}`}</p>
        </div>
      </div>
      <div className="border-black border-1.5 border-opacity-40 p-5 w-full rounded-md">
        <p className="font-semibold text-lg mb-5">
          Información de servicios seleccionados
        </p>
        <div className="flex flex-col gap-3">
          {props.selectedServicesOrders.map((service) => (
            <div>
              <div
                className="flex items-center justify-between"
                key={service.id}
              >
                <div className="flex gap-2 items-center">
                  <p>{service.service!.name}</p>
                  <p className="text-black text-opacity-70 text-sm">
                    {`(${service.service!.description})`}
                  </p>
                </div>
                <p>{`${service.cost.toFixed(2)} REF`}</p>
              </div>
              <Divider />
            </div>
          ))}
          <div className="w-full flex justify-end">
            <p className="font-semibold text-lg">
              {`Total: ${props.selectedServicesOrders
                .reduce((prev, curr) => prev + curr.cost, 0)
                .toFixed(2)} REF`}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Enviar cotización"
            type="button"
            variant="solid"
            isLoading={isCreatingOrder}
            onClick={handleCreateOrder}
          />
        </div>
      </div>
    </div>
  );
}
