import { Spinner, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { OrderModel } from "../../../../../entities/order/model";
import { usePersistedStore } from "../../../../../store/store";
import { useCompanyApiServices } from "../../../../api/companies";
import { useVehicleApiServices } from "../../../../api/vehicles";
import { OrderDetailComponent } from "../../../../../entities/order/components/detail";
import CompanyInfo from "../../../../../entities/company/components/info";
import CompanyModel from "../../../../../entities/company/model";
import UserInfo from "../../../../../entities/user/components/info";
import VehicleModel from "../../../../../entities/vehicle/model";
import VehicleInfo from "../../../../../entities/vehicle/components/info";
import { UserServiceOrderInfoComponent } from "./user_service_order_info_component";

type Props = {
  order: OrderModel;
};

type TabContent =
  | "quote_info"
  | "company_info"
  | "user_and_vehicle_info"
  | "services_orders_info";

export function UserOrderInfoComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const [selected, setSelected] = useState<TabContent>("quote_info");

  const [showInfo, setShowInfo] = useState(false);

  const {
    getCompanyResponse,
    isGettingCompany,
    perform: getCompany,
  } = useCompanyApiServices.getCompany();

  const {
    getVehicleResponse,
    isGettingVehicle,
    perform: getVehicle,
  } = useVehicleApiServices.getVehicle();

  useEffect(() => {
    getCompany(props.order.company_id!);
    getVehicle(props.order.vehicle_id!, token!);
  }, []);

  useEffect(() => {
    if (getCompanyResponse && getVehicleResponse) setShowInfo(true);
  }, [getCompanyResponse, getVehicleResponse]);

  return (
    <div className="w-full h-full">
      {isGettingCompany || isGettingVehicle ? (
        <Spinner />
      ) : !showInfo ? null : (
        <Tabs
          aria-label="Options"
          selectedKey={selected}
          onSelectionChange={(value) => setSelected(value as TabContent)}
          variant="underlined"
        >
          <Tab key="quote_info" title="Información de la orden de servicio">
            <OrderDetailComponent order={props.order} />
          </Tab>
          <Tab key="company_info" title="Información de la empresa">
            <CompanyInfo
              company={
                (getCompanyResponse?.data as CompanyModel) ||
                ({} as CompanyModel)
              }
              imagesAreCommingFrom="server"
              showChangeAvatar={false}
            />
          </Tab>
          <Tab
            key="user_and_vehicle_info"
            title="Información de usuario y de vehículo"
            className="flex flex-col gap-5"
          >
            <UserInfo
              user={(getVehicleResponse?.data as VehicleModel).user!}
              isUpdatable={false}
            />
            <VehicleInfo
              dataCommingFrom="server"
              vehicle={getVehicleResponse?.data as VehicleModel}
            />
          </Tab>
          <Tab
            key="services_orders_info"
            title="Información de servicios"
            className="w-full flex flex-col gap-5"
          >
            <p className="font-semibold font-inter text-xl">
              {`Kilometraje del vehículo: ${props.order.vehicle_mileage} Km`}
            </p>
            {props.order.services_orders!.map((service_order) => (
              <div
                className="w-full border-black border-1.5 border-opacity-40 rounded-md px-3 py-5"
                key={service_order.id}
              >
                <UserServiceOrderInfoComponent
                  service_order={service_order}
                  key={service_order.id}
                />
              </div>
            ))}
            <div className="w-full flex justify-end">
              <p className="text-lg font-semibold">
                {`Total: ${props.order
                  .services_orders!.reduce(
                    (prev, curr) => prev + Number(curr.cost),
                    0
                  )
                  .toFixed(2)} REF`}
              </p>
            </div>
          </Tab>
        </Tabs>
      )}
    </div>
  );
}
