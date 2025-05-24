import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { OrderModel, OrderStatus } from "../model";
import { usePersistedStore } from "../../../store/store";
import { useCompanyApiServices } from "../../../app/api/companies";
import { useVehicleApiServices } from "../../../app/api/vehicles";
import CompanyInfo from "../../company/components/info";
import CompanyModel from "../../company/model";
import UserInfo from "../../user/components/info";
import VehicleModel from "../../vehicle/model";
import VehicleInfo from "../../vehicle/components/info";
import { CompanyServiceOrderInfoComponent } from "../../service_order/components/service_orders";
import { OrderDetailComponent } from "./detail";
import { IoMdArrowDropdown } from "react-icons/io";
import { useOrderApiServices } from "../../../app/api/orders";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../components/toaster/context/context";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/buttons/component";
import { useServiceOrderApiServices } from "../../../app/api/services_orders";
import {
  ServiceOrderModel,
  ServiceOrderStatus,
} from "../../service_order/model";
import DatatableComponent from "../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../components/datatable/types";
import useDataFromDatatable from "../../../components/datatable/use_data";
import ServicePricesComponent from "../../service/components/prices/component";
import PaginationComponent from "../../../components/datatable/pagination";
import { VehicleType } from "../../vehicle/types";
import { UserCompanyRole } from "../../users_companies/types";
import { useUserOrderReviewsApiServices } from "../../../app/api/user_order_reviews";
import RatingComponent from "../../../components/rating";
import { LuMessageCircle } from "react-icons/lu";

type Props = {
  order: OrderModel;
  order_id?: number;
};

type TabContent =
  | "quote_info"
  | "company_info"
  | "user_and_vehicle_info"
  | "services_orders_info";

const TABLE_COLUMNS: DatatableColumnsProps[] = [
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "description",
    label: "Descripción",
  },
  {
    key: "category",
    label: "Categoria",
  },
  {
    key: "prices",
    label: "Precios expresados en REF",
  },
  {
    key: "actions",
    label: "Acciones",
  },
];

export function CompanyOrderInfoComponent(props: Props) {
  const { token, sessionType } = usePersistedStore().authReducer;

  const [selected, setSelected] = useState<TabContent>("quote_info");

  const [showInfo, setShowInfo] = useState(false);

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { selectedValues, setSelectedValues } = useDataFromDatatable();

  const { isUpdatingOrder, perform: updateOrder } =
    useOrderApiServices.updateOrder();

  const { isUpdatingServicesOrders, perform: updateServicesOrders } =
    useServiceOrderApiServices.updateServicesOrdersStatus();

  const {
    perform: createServicesOrdersInBatch,
    isCreatingServicesOrdersInBatch,
  } = useServiceOrderApiServices.createServicesOrdersInBatch();

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

  const [closeQuoteState, setCloseQuoteState] = useState<boolean>(false);

  const [finishOrCancelOrder, setFinishOrCancelOrder] = useState<
    OrderStatus.FINISHED | OrderStatus.CANCELED
  >(OrderStatus.FINISHED);

  const {
    getCompanyServicesResponse,
    isGettingCompanyServices,
    perform: getCompanyServices,
  } = useCompanyApiServices.getCompanyServices();

  const [page, setPage] = useState<number>(1);

  const {
    getReviewResponse,
    isGettingReview,
    perform: getReview,
  } = useUserOrderReviewsApiServices.getReview();

  useEffect(() => {
    getCompany(props.order.company_id!);
    getVehicle(props.order.vehicle_id!, token!);

    if (!props.order.is_checked) {
      updateOrder(
        {
          id: props.order.id,
          is_checked: true,
        } as OrderModel,
        sessionType!.company_id!,
        token!
      );
    }

    if (
      props.order.status === OrderStatus.FINISHED ||
      props.order.status === OrderStatus.CANCELED
    ) {
      getReview(props.order.id!, token!, sessionType!.company_id!);
    }
  }, []);

  useEffect(() => {
    getCompanyServices(sessionType!.company_id!, page);
  }, [page]);

  useEffect(() => {
    if (getCompanyResponse && getVehicleResponse) setShowInfo(true);
  }, [getCompanyResponse, getVehicleResponse]);

  async function handleUpdateQuote() {
    const response = await updateOrder(
      {
        id: props.order.id,
        is_active: false,
        status: closeQuoteState
          ? OrderStatus.QUOTE
          : OrderStatus.ACTIVE_FOR_ORDER_CREATION,
      } as OrderModel,
      sessionType!.company_id!,
      token!
    );

    if (response.status === StatusCodes.OK) {
      toasterDispatch({
        payload: "Cotización actualizada correctamente",
        type: "SUCCESS",
      });
      navigate(0);
      return;
    }

    toasterDispatch({
      payload:
        (response.data as { errors: string[] })?.errors[0] ||
        "Error al actualizar la cotización",
      type: "ERROR",
    });
  }

  function handleGroupSelection(value: any) {
    const data = value.values().next().value;
    setCloseQuoteState(data === "true");
  }

  function handleFinishOrCloseOrder(value: any) {
    const data = value.values().next().value;
    setFinishOrCancelOrder(data as OrderStatus.CANCELED | OrderStatus.FINISHED);
  }

  async function handleCreateOrderFromQuote() {
    const orderResponse = await updateOrder(
      {
        id: props.order.id,
        status: OrderStatus.IN_PROGRESS,
        is_active: true,
      } as OrderModel,
      sessionType!.company_id!,
      token!
    );

    if (orderResponse.status === StatusCodes.OK) {
      const servicesOrdersResponse = await updateServicesOrders(
        {
          order_id: props.order.id,
          status: ServiceOrderStatus.IN_PROGRESS,
        } as ServiceOrderModel,
        token!
      );

      if (servicesOrdersResponse.status === StatusCodes.OK) {
        toasterDispatch({
          payload: "Órdenes de servicio creadas correctamente",
          type: "SUCCESS",
        });
        navigate("/dashboard/services/orders");
        return;
      }
    }

    toasterDispatch({
      payload:
        (orderResponse.data as { errors: string[] })?.errors[0] ||
        "Error al crear la orden de servicio",
      type: "ERROR",
    });
  }

  function getPriceFromService(id: number) {
    const service = getCompanyServicesResponse?.data?.data?.find(
      (s) => s.id === id
    );
    switch (props.order.vehicle?.vehicle_type) {
      case VehicleType.MOTORBIKE:
        return service?.price_for_motorbike;
      case VehicleType.CAR:
        return service?.price_for_car;
      case VehicleType.TRUCK:
        return service?.price_for_truck;
      case VehicleType.VAN:
        return service?.price_for_van;
    }
  }

  async function handleCreateServicesOrdersInBatch() {
    const response = await createServicesOrdersInBatch(
      (selectedValues as number[]).map(
        (element) =>
          ({
            order_id: props.order.id,
            service_id: element,
            status:
              props.order.status === OrderStatus.QUOTE ||
              props.order.status === OrderStatus.ACTIVE_FOR_ORDER_CREATION
                ? ServiceOrderStatus.PENDING_FOR_QUOTE_APPROVEMENT
                : ServiceOrderStatus.IN_PROGRESS,
            cost: getPriceFromService(element),
          } as ServiceOrderModel)
      ),
      props.order.id!,
      token!
    );

    if (response.status === StatusCodes.CREATED) {
      toasterDispatch({
        payload: "Órdenes de servicio creadas correctamente",
        type: "SUCCESS",
      });
      navigate(0);
      return;
    }

    toasterDispatch({
      payload: "Error al crear la orden de servicio",
      type: "ERROR",
    });
  }

  async function handleFinishOrCancelOrder() {
    const response = await updateOrder(
      {
        id: props.order.id,
        status: finishOrCancelOrder,
        is_active: false,
      } as OrderModel,
      sessionType!.company_id!,
      token!
    );

    if (response.status === StatusCodes.OK) {
      toasterDispatch({
        payload: `Orden de servicio ${
          finishOrCancelOrder === OrderStatus.FINISHED
            ? "finalizada"
            : "cancelada"
        } correctamente`,
        type: "SUCCESS",
      });
      navigate(0);
      return;
    }

    toasterDispatch({
      payload:
        (response.data as { errors: string[] })?.errors[0] ||
        "Error al finalizar la orden de servicio",
      type: "ERROR",
    });
  }

  return (
    <>
      <Modal
        className="p-5"
        radius="sm"
        size="3xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <DatatableComponent
              columns={TABLE_COLUMNS}
              data={
                !getCompanyServicesResponse || !getCompanyServicesResponse.data
                  ? []
                  : getCompanyServicesResponse.data.data.map((element) => ({
                      id: element.id,
                      name: element.name,
                      description: element.description,
                      category: element.category!.name,
                      prices: <ServicePricesComponent service={element} />,
                    })) || []
              }
              selectedData={selectedValues}
              setSelectedData={setSelectedValues}
              selectionMode="multiple"
              isLoading={isGettingCompanyServices}
              noContentMessage="No hay servicios registrados"
              isRowDataEditable
              isRowDataDeletable
            />
            <div className="mt-3 w-full flex justify-end items-center gap-5">
              <ButtonComponent
                color="primary"
                text="Agregar servicios"
                type="button"
                variant="solid"
                isDisabled={selectedValues.length === 0}
                onClick={handleCreateServicesOrdersInBatch}
                isLoading={isCreatingServicesOrdersInBatch}
              />
              <PaginationComponent
                page={page}
                setPage={setPage}
                pages={getCompanyServicesResponse?.data?.total_pages || 0}
              />
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
              {props.order.is_active &&
                props.order.status === OrderStatus.QUOTE && (
                  <ButtonGroup variant="flat" className="mt-5" radius="sm">
                    <Button
                      onClick={handleUpdateQuote}
                      isLoading={isUpdatingOrder}
                      className={
                        !closeQuoteState
                          ? "text-primary border-primary border-1.5"
                          : "text-red-500 border-1.5 "
                      }
                    >
                      {`${closeQuoteState ? "Cerrar" : "Aprobar"} cotización`}
                    </Button>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          className={
                            !closeQuoteState
                              ? "text-primary border-primary border-1.5"
                              : "text-red-500 border-1.5 "
                          }
                        >
                          <IoMdArrowDropdown />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        disallowEmptySelection
                        aria-label="Merge options"
                        selectedKeys={new Set([closeQuoteState.toString()])}
                        selectionMode="single"
                        onSelectionChange={(selectedOption) =>
                          handleGroupSelection(selectedOption)
                        }
                        className="max-w-[300px]"
                      >
                        <DropdownItem
                          key="false"
                          className="whitespace-normal"
                          description={
                            <span className="block max-w-xs whitespace-normal">
                              Al aprobarla se le confirmará al usuario que el costo total de los servicios es el indicado por la cotización
                            </span>
                          }
                        >
                          Aprobar cotización
                        </DropdownItem>
                        <DropdownItem
                          className="whitespace-normal"
                          key="true"
                          description={
                            <span className="block max-w-xs whitespace-normal">
                              Al cerrarla, la cotización no estará disponible para crear una orden de servicio, y se le notificará al usuario que la cotización ha sido cerrada
                            </span>
                          }
                        >
                          Cerrar cotización
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </ButtonGroup>
                )}
              {!props.order.is_active &&
                props.order.is_checked &&
                props.order.status ===
                  OrderStatus.ACTIVE_FOR_ORDER_CREATION && (
                  <div className="flex mt-5">
                    <div className="w-auto">
                      <ButtonComponent
                        color="primary"
                        text="Crear órdenes de servicios a partir de cotización"
                        type="button"
                        variant="solid"
                        onClick={handleCreateOrderFromQuote}
                        isLoading={isUpdatingOrder || isUpdatingServicesOrders}
                      />
                    </div>
                  </div>
                )}
              {sessionType!.roles!.includes(UserCompanyRole.ADMIN) &&
                props.order.status === OrderStatus.IN_PROGRESS && (
                  <ButtonGroup variant="flat" className="mt-5" radius="sm">
                    <Button
                      onClick={handleFinishOrCancelOrder}
                      // isLoading={}
                      className={
                        finishOrCancelOrder === OrderStatus.FINISHED
                          ? "text-primary border-primary border-1.5"
                          : "text-red-500 border-1.5 "
                      }
                    >
                      {`${
                        finishOrCancelOrder === OrderStatus.FINISHED
                          ? "Dar por finalizada la orden de servicio"
                          : "Dar por cancelada la orden de servicio"
                      }`}
                    </Button>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          className={
                            finishOrCancelOrder === OrderStatus.FINISHED
                              ? "text-primary border-primary border-1.5"
                              : "text-red-500 border-1.5 "
                          }
                        >
                          <IoMdArrowDropdown />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        disallowEmptySelection
                        aria-label="Merge options"
                        selectedKeys={new Set([closeQuoteState.toString()])}
                        selectionMode="single"
                        onSelectionChange={(selectedOption) =>
                          handleFinishOrCloseOrder(selectedOption)
                        }
                        className="max-w-[300px]"
                      >
                        <DropdownItem
                          key={OrderStatus.FINISHED}
                          className="whitespace-normal"
                          description={
                            <span className="block max-w-xs whitespace-normal">
                              Se le notificará al usuario que la orden de servicio ha sido finalizada. Esta orden ya no podrá ser actualizada. Asegúrese de que todas las órdenes de servicio de esta orden estén en estado Finalizado antes de continuar.
                            </span>
                          }
                        >
                          Dar por finalizada la cotización
                        </DropdownItem>
                        <DropdownItem
                          key={OrderStatus.CANCELED}
                          className="whitespace-normal"
                          description={
                            <span className="block max-w-xs whitespace-normal">
                              Se le notificará al usuario que la orden de servicio ha sido cancelada. Solo se considerará aquellos servicios con estado finalizado para el cálculo del total a cobrar al usuario.
                            </span>
                          }
                        >
                          Dar por cancelada la cotización
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </ButtonGroup>
                )}
              <div className="w-full flex justify-end mt-5">
                {(props.order.status === OrderStatus.FINISHED ||
                  props.order.status === OrderStatus.CANCELED) &&
                  (isGettingReview ? (
                    <Spinner />
                  ) : !getReviewResponse ? null : !getReviewResponse.data ? null : (
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
            {sessionType!.roles!.includes(UserCompanyRole.ADMIN) ||
              (sessionType!.roles!.includes(UserCompanyRole.SUPERVISOR) && (
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
              ))}
            <Tab
              key="services_orders_info"
              title="Información de servicios"
              className="w-full flex flex-col gap-5"
            >
              <p className="font-semibold font-inter text-xl">
                {`Kilometraje del vehículo: ${props.order.vehicle_mileage} Km`}
              </p>
              {(props.order.status === OrderStatus.IN_PROGRESS ||
                props.order.status === OrderStatus.QUOTE) && (
                <div className="w-full flex justify-end">
                  <div className="w-auto">
                    <ButtonComponent
                      color="primary"
                      text="Agregar servicio"
                      type="button"
                      variant="solid"
                      onClick={onOpen}
                    />
                  </div>
                </div>
              )}
              {props.order.services_orders!.map((service_order) => (
                <div
                  className="w-full border-black border-1.5 border-opacity-40 rounded-md px-3 py-5"
                  key={service_order.id}
                >
                  <CompanyServiceOrderInfoComponent
                    order_id={props.order_id!}
                    service_order={service_order}
                    key={service_order.id}
                    order_status={props.order.status}
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
