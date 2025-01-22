import { RiEBikeLine } from "react-icons/ri";
import ServiceModel from "../../../../../../../entities/service/model";
import UserModel from "../../../../../../../entities/user/model";
import { VehicleHelpers } from "../../../../../../../entities/vehicle/helpers";
import VehicleModel from "../../../../../../../entities/vehicle/model";
import { VehicleType } from "../../../../../../../entities/vehicle/types";
import DatatableComponent from "../../../../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../../../../components/datatable/types";
import { FaCar } from "react-icons/fa";
import { FaTruckField, FaTruckFront } from "react-icons/fa6";
import TextComponent from "../../../../../../../components/inputs/text";
import { useContext, useState } from "react";
import { Checkbox, Divider } from "@nextui-org/react";
import ButtonComponent from "../../../../../../../components/buttons/component";
import { NumberInputHelper } from "../../../../../../../components/inputs/helpers";
import { useQuoteApiServices } from "../../../../../../api/quotes";
import { useNavigate } from "react-router-dom";
import { ToasterContext } from "../../../../../../../components/toaster/context/context";
import {
  QuoteModel,
  QuoteStatus,
} from "../../../../../../../entities/quote/model";
import { usePersistedStore } from "../../../../../../../store/store";
import { StatusCodes } from "http-status-codes";

type Props = {
  selectedUser: UserModel;
  selectedVehicle: VehicleModel;
  selectedServices: ServiceModel[];
  onPrevStep: () => void;
};

function ServicePriceComponent({
  service,
  vehicle_type,
}: {
  service: ServiceModel;
  vehicle_type: VehicleType;
}) {
  return (
    <div className="flex flex-col">
      {service.price_for_motorbike &&
        vehicle_type === VehicleType.MOTORBIKE && (
          <div className="flex gap-2 items-center">
            <RiEBikeLine className="text-black text-opacity-40 w-5 h-5" />
            <p className="text-sm">{`${(
              service.price_for_motorbike as number
            ).toFixed(2)} REF`}</p>
          </div>
        )}
      {service.price_for_car && vehicle_type === VehicleType.CAR && (
        <div className="flex gap-2 items-center">
          <FaCar className="text-black text-opacity-40 w-5 h-5" />
          <p className="text-sm">{`${(service.price_for_car as number).toFixed(
            2
          )} REF`}</p>
        </div>
      )}
      {service.price_for_van && vehicle_type === VehicleType.VAN && (
        <div className="flex gap-2 items-center">
          <FaTruckField className="text-black text-opacity-40 w-5 h-5" />
          <p className="text-sm">{`${(service.price_for_van as number).toFixed(
            2
          )} REF`}</p>
        </div>
      )}
      {service.price_for_truck && vehicle_type === VehicleType.TRUCK && (
        <div className="flex gap-2 items-center">
          <FaTruckFront className="text-black text-opacity-40 w-5 h-5" />
          <p className="text-sm">{`${(
            service.price_for_truck as number
          ).toFixed(2)} REF`}</p>
        </div>
      )}
    </div>
  );
}

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "name", label: "Nombre" },
  { key: "category", label: "Categoría" },
  { key: "description", label: "Descripción" },
  { key: "price", label: "Precio" },
];

export function ConfirmNewQuoteComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const { isCreatingQuotes, perform } = useQuoteApiServices.createQuotes();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  const [quoteDetail, setQuoteDetail] = useState<{
    note: string;
    service_cost: string;
  }>({
    note: "",
    service_cost: "0.00",
  });

  const [changePrice, setChangePrice] = useState(false);

  function getPriceByVehicleType() {
    const value = props.selectedServices.reduce((acc, service) => {
      switch (props.selectedVehicle.vehicle_type) {
        case VehicleType.MOTORBIKE:
          return acc + (service.price_for_motorbike as number);
        case VehicleType.CAR:
          return acc + (service.price_for_car as number);
        case VehicleType.VAN:
          return acc + (service.price_for_van as number);
        case VehicleType.TRUCK:
          return acc + (service.price_for_truck as number);
        default:
          return acc;
      }
    }, 0);

    return value.toFixed(2);
  }

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setQuoteDetail({ ...quoteDetail, note: e.target.value });
  }

  function handlePriceChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, quoteDetail.service_cost);
    setQuoteDetail({ ...quoteDetail, service_cost: value });
  }

  function buildQuotePayloadRequest() {
    return props.selectedServices.map(
      (service) =>
        ({
          date: new Date(),
          note: quoteDetail.note,
          total_cost: changePrice
            ? Number(quoteDetail.service_cost)
            : Number(getPriceByVehicleType()),
          status_by_company: QuoteStatus.APPROVED,
          status_by_client: QuoteStatus.PENDING,
          vehicle_id: props.selectedVehicle.id!,
          service_id: service.id,
        } as QuoteModel)
    );
  }

  async function createQuote() {
    const response = await perform(buildQuotePayloadRequest(), token!);

    if (response.status === StatusCodes.CREATED) {
      toasterDispatch({
        payload: "Cotización creada exitosamente",
        type: "SUCCESS",
      });
      navigate("/dashboard/services/quotes");
    } else {
      toasterDispatch({
        payload: response.data.message || "Error al crear la cotización",
        type: "ERROR",
      });
    }
  }

  return (
    <div className="w-full flex flex-col">
      <p className="font-semibold text-2xl font-inter">
        Confirmación de cotización
      </p>
      <div className="w-full grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div className="flex flex-col mt-5 p-5 border-black border-1.5 rounded-md border-opacity-50">
          <p className="font-inter font-semibold">Persona seleccionada</p>
          <p className="">{`${props.selectedUser.first_name} ${props.selectedUser.last_name}`}</p>
          <p className="">{`${props.selectedUser.dni}`}</p>
          <p className="">{`${props.selectedUser.email}`}</p>
        </div>
        <div className="flex flex-col mt-5 p-5 border-black border-1.5 rounded-md border-opacity-50">
          <p className="font-inter font-semibold">Vehículo seleccionado</p>
          <p>{`Marca: ${props.selectedVehicle.model!.brand!.name}`}</p>
          <p>{`Tipo de vehículo: ${VehicleHelpers.translateVehicleType(
            props.selectedVehicle.vehicle_type
          )}`}</p>
          <p>{`Placa: ${props.selectedVehicle.license_plate}`}</p>
        </div>
        <div className="col-span-full">
          <div className="p-5 border-black border-1.5 rounded-md border-opacity-50">
            <p className="font-inter font-semibold">Servicios seleccionados</p>
            <div className="mt-5">
              <DatatableComponent
                columns={DATATABLE_COLUMNS}
                data={
                  props.selectedServices.map((service) => ({
                    id: service.id,
                    name: service.name,
                    category: service.category!.name,
                    description: service.description,
                    price: (
                      <ServicePriceComponent
                        service={service}
                        vehicle_type={props.selectedVehicle.vehicle_type}
                      />
                    ),
                  })) || []
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 w-full flex justify-end">
        <p>{`Monto total: ${getPriceByVehicleType()} REF`}</p>
      </div>
      <Divider className="my-5" />
      <div className="mt-3 p-5 border-black border-1.5 rounded-md border-opacity-50">
        <p className="font-semibold font-inter mb-2">Detalle</p>
        <TextComponent
          name="note"
          label="Nota para el cliente (opcional)"
          type="text"
          onChange={handleNoteChange}
          value={quoteDetail.note}
          variant="bordered"
        />
        <div className="flex mt-5 gap-2">
          <Checkbox
            isSelected={changePrice}
            onValueChange={setChangePrice}
            radius="sm"
          >
            Cambiar precio total
          </Checkbox>
          {changePrice && (
            <div className="flex ml-5">
              <div className="m-auto">
                <TextComponent
                  name="service_cost"
                  label="Monto total (en REF)"
                  type="text"
                  value={quoteDetail.service_cost || ""}
                  onKeyDown={handlePriceChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end items-center gap-3 mt-5">
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Regresar"
            type="button"
            variant="bordered"
            onClick={props.onPrevStep}
          />
        </div>
        <div className="w-auto">
          <ButtonComponent
            color="primary"
            text="Confirmar"
            type="button"
            variant="solid"
            onClick={createQuote}
            isLoading={isCreatingQuotes}
          />
        </div>
      </div>
    </div>
  );
}
