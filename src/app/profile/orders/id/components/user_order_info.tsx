import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { OrderModel, OrderStatus } from "../../../../../entities/order/model";
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
import ButtonComponent from "../../../../../components/buttons/component";
import LogoComponent from "../../../../../components/logo/component";
import RatingComponent from "../../../../../components/rating";
import { useUserOrderReviewsApiServices } from "../../../../api/user_order_reviews";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { LuMessageCircle } from "react-icons/lu";

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

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const [reviewMessage, setReviewMessage] = useState("");

  const [rating, setRating] = useState<number>(0);

  const navigate = useNavigate();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const {
    getReviewResponse,
    isGettingReview,
    perform: getReview,
  } = useUserOrderReviewsApiServices.getReview();

  const { isCreatingReview, perform: createReview } =
    useUserOrderReviewsApiServices.createReview();

  useEffect(() => {
    getCompany(props.order.company_id!);
    getVehicle(props.order.vehicle_id!, token!);
    getReview(props.order.id!, token!);
  }, []);

  useEffect(() => {
    if (getCompanyResponse && getVehicleResponse) setShowInfo(true);
  }, [getCompanyResponse, getVehicleResponse]);

  async function handleCreateReview() {
    const response = await createReview(
      {
        order_id: props.order.id!,
        rating,
        message: reviewMessage,
      },
      token!
    );

    if (response.status === StatusCodes.CREATED) {
      toasterDispatch({
        payload: "Calificación creada exitosamente",
        type: "SUCCESS",
      });
      navigate(0);
      return;
    }

    toasterDispatch({
      payload:
        "errors" in response.data
          ? response.data.errors[0]
          : "Ocurrió un error al calificar la orden",
      type: "ERROR",
    });
  }

  return (
    <>
      <Modal
        radius="sm"
        className="p-5"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col gap-5 justify-center items-center">
              <LogoComponent />
              <p className="font-semibold">Calificación de orden</p>
              <RatingComponent onRatingChange={setRating} />
              <Textarea
                radius="sm"
                label="Mensaje de calificación"
                value={reviewMessage}
                variant="bordered"
                onValueChange={setReviewMessage}
              />
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Confirmar calificación"
                  type="button"
                  variant="solid"
                  isDisabled={rating === 0}
                  onClick={handleCreateReview}
                  isLoading={isCreatingReview}
                />
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
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
              <div className="w-full flex justify-end mt-5">
                {(props.order.status === OrderStatus.FINISHED ||
                  props.order.status === OrderStatus.CANCELED) &&
                  (isGettingReview ? (
                    <Spinner />
                  ) : !getReviewResponse ? null : !getReviewResponse.data ? (
                    <div className="w-auto">
                      <ButtonComponent
                        color="primary"
                        text="Calificar servicio"
                        type="button"
                        variant="ghost"
                        onClick={onOpen}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-5 md:flex-row justify-end items-center">
                      <p>Calificación del servicio: </p>
                      <RatingComponent
                        isDisabled
                        rating={getReviewResponse.data.rating}
                      />
                      {getReviewResponse.data.message && (
                        <Popover placement="bottom">
                          <PopoverTrigger>
                            <Button isIconOnly variant="bordered" radius="sm">
                              <LuMessageCircle />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-5">
                            <p>{`Reseña: ${getReviewResponse.data.message}`}</p>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  ))}
              </div>
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
    </>
  );
}
