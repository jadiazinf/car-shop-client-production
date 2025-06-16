import { useContext, useEffect, useState } from "react";
import UserModel from "../../../../../entities/user/model";
import { SearchUserForNewOrderService } from "./components/search_user";
import { SearchUserVehicleForNewOrderService } from "./components/search_vehicle";
import VehicleModel from "../../../../../entities/vehicle/model";
import { ServiceOrderModel } from "../../../../../entities/service_order/model";
import { SelectServices } from "./components/select_services/component";
import ButtonComponent from "../../../../../components/buttons/component";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import { useOrderApiServices } from "../../../../api/orders";
import { useNavigate } from "react-router-dom";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { usePersistedStore } from "../../../../../store/store";
import { OrderStatus } from "../../../../../entities/order/model";
import { StatusCodes } from "http-status-codes";

enum NewOrderStages {
  SEARCH_USER,
  SELECT_VEHICLE,
  SELECT_SERVICES,
  CONFIRM,
}

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
    text: "Órdenes de servicios",
    url: "/dashboard/services/orders",
  },
  {
    text: "Crear orden de servicio",
    url: "/dashboard/services/orders/new",
  },
];

export function NewCompanyOrder() {
  const { token, sessionType } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [stage, setStage] = useState<NewOrderStages>(
    NewOrderStages.SEARCH_USER
  );

  const [selectedPerson, setSelectedPerson] = useState<UserModel | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(
    null
  );

  const [vehicle_mileage, setVehicleMileage] = useState<number | null>(null);

  const [selectedServicesOrders, setSelectedServicesOrders] = useState<
    ServiceOrderModel[]
  >([]);

  const { isCreatingOrder, perform } = useOrderApiServices.createOrder();

  const navigate = useNavigate();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  async function handleCreateNewOrder() {
    const response = await perform(
      {
        is_checked: true,
        status: OrderStatus.IN_PROGRESS,
        vehicle_mileage: vehicle_mileage!,
        services_orders: selectedServicesOrders,
        company_id: sessionType!.company_id!,
        vehicle_id: selectedVehicle!.id!,
        is_active: true,
      },
      token!
    );

    if (response.status === StatusCodes.CREATED) {
      toasterDispatch({
        payload: "Orden de servicio creada correctamente",
        type: "SUCCESS",
      });
      navigate("/dashboard/services/orders");
      return;
    }

    toasterDispatch({
      payload: "Error al crear orden de servicio",
      type: "ERROR",
    });
  }

  return (
    <div className="w-full h-full">
      {stage === NewOrderStages.SEARCH_USER ? (
        <div>
          <SearchUserForNewOrderService
            onNext={() => setStage(NewOrderStages.SELECT_VEHICLE)}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
          />
          <p className="font-semibold text-xl">
            {selectedPerson &&
              "Persona seleccionada:" +
                " " +
                selectedPerson.first_name +
                " " +
                selectedPerson.last_name}
          </p>
        </div>
      ) : stage === NewOrderStages.SELECT_VEHICLE ? (
        <SearchUserVehicleForNewOrderService
          onNext={() => setStage(NewOrderStages.SELECT_SERVICES)}
          onPrev={() => setStage(NewOrderStages.SEARCH_USER)}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
          setVehicleMileage={setVehicleMileage}
          user_id={selectedPerson!.id!}
        />
      ) : stage === NewOrderStages.SELECT_SERVICES ? (
        <SelectServices
          onNext={() => setStage(NewOrderStages.CONFIRM)}
          onPrev={() => setStage(NewOrderStages.SELECT_VEHICLE)}
          selectedServicesOrders={selectedServicesOrders}
          setSelectedServicesOrders={setSelectedServicesOrders}
          vehicle_type={selectedVehicle!.vehicle_type}
        />
      ) : stage === NewOrderStages.CONFIRM ? (
        <div className="w-full h-full">
          <p className="font-semibold text-lg">
            Confirmación de nueva orden de servicio
          </p>
          <div className="mt-5">
            <div className="border-1.5 border-black border-opacity-50 p-5 rounded-md">
              <p className="font-semibold">Persona seleccionada</p>
              <div className="flex justify-between items-center gap-1.5 flex-col md:flex-row md:gap-5 mt-5">
                <p>
                  {`Nombre: ${selectedPerson?.first_name} ${selectedPerson?.last_name}`}
                </p>
                <p>{`Correo: ${selectedPerson?.email}`}</p>
                <p>{`Número de teléfono: ${selectedPerson?.phone_number}`}</p>
              </div>
            </div>
            <div className="border-1.5 border-black border-opacity-50 p-5 rounded-md mt-5">
              <p className="font-semibold">Vehículo seleccionado</p>
              <div className="flex justify-between items-center gap-1.5 flex-col md:flex-row md:gap-5 mt-5">
                <p>
                  {`Vehículo: ${selectedVehicle?.model?.brand?.name} ${selectedVehicle?.model?.name}`}
                </p>
                <p>{`Año: ${selectedVehicle?.year}`}</p>
                <p>{`Color: ${selectedVehicle?.color}`}</p>
                <p>{`Placa: ${selectedVehicle?.license_plate}`}</p>
                <p>{`Kilometraje: ${vehicle_mileage} Kms`}</p>
              </div>
            </div>
            <div className="border-1.5 border-black border-opacity-50 p-5 rounded-md mt-5">
              <p className="font-semibold">Servicios seleccionados</p>
              {selectedServicesOrders.map((service_order) => (
                <div
                  className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b-1.5 border-black border-opacity-50 py-2 cursor-pointer"
                  key={service_order.service_id}
                >
                  <div className="flex h-full items-center gap-2 col-span-2">
                    <div>
                      <p>{service_order.service!.name}</p>
                      <p className="text-sm text-black text-opacity-50">
                        {service_order.service!.description}
                      </p>
                    </div>
                  </div>
                  <div className="h-full flex items-center">
                    <p>{`Categoría: ${
                      service_order.service!.category!.name
                    }`}</p>
                  </div>
                  <div className="h-full flex justify-end items-center gap-5">
                    <p>{`Costo: ${Number(service_order.cost).toFixed(
                      2
                    )} REF`}</p>
                  </div>
                </div>
              ))}
              <div className="w-full flex justify-end mt-5">
                {`Total: ${selectedServicesOrders
                  .reduce((acc, service_order) => acc + service_order.cost, 0)
                  .toFixed(2)} REF`}
              </div>
            </div>
          </div>
          <div className="w-full mt-5 flex justify-end">
            <div className="w-auto">
              <ButtonComponent
                color="primary"
                text="Atrás"
                type="button"
                onClick={() => setStage(NewOrderStages.SELECT_SERVICES)}
                variant="light"
              />
            </div>
            <div className="w-auto">
              <ButtonComponent
                color="primary"
                text="Siguiente"
                type="button"
                variant="solid"
                onClick={handleCreateNewOrder}
                isLoading={isCreatingOrder}
                isDisabled={
                  selectedPerson === null ||
                  selectedVehicle === null ||
                  vehicle_mileage === null ||
                  selectedServicesOrders === null ||
                  selectedServicesOrders.length === 0
                }
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
