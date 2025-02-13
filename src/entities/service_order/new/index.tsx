import { Checkbox } from "@nextui-org/react";
import ServiceModel from "../../service/model";
import { ServiceOrderModel, ServiceOrderStatus } from "../model";
import { VehicleType } from "../../vehicle/types";
import { useEffect, useState } from "react";
import { NumberInputHelper } from "../../../components/inputs/helpers";
import TextComponent from "../../../components/inputs/text";

type Props = {
  service: ServiceModel;
  included: boolean;
  handleServiceOrderSelection: (service: ServiceOrderModel) => void;
  vehicleType: VehicleType;
  status: ServiceOrderStatus;
};

export function NewServiceOrderComponent(props: Props) {
  const [price, setSelectedPrice] = useState<string>(
    (props.service as any)[
      `price_for_${props.vehicleType.toLowerCase()}`
    ].toString()
  );

  const [changeServiceCost, setChangeServiceCost] = useState(false);

  useEffect(() => {
    if (!changeServiceCost) {
      setSelectedPrice(
        (props.service as any)[
          `price_for_${props.vehicleType.toLowerCase()}`
        ].toString()
      );
    } else {
      setSelectedPrice("0.00");
    }
  }, [changeServiceCost]);

  function handleServiceCostChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, price as string);
    setSelectedPrice(value);
  }

  return (
    <div className="w-full px-2 py-2 flex gap-2">
      <div className="h-full w-full flex justify-center items-center">
        <Checkbox
          isSelected={props.included}
          onChange={() =>
            props.handleServiceOrderSelection({
              cost: Number(price),
              service_id: props.service.id,
              status: props.status,
            })
          }
          radius="sm"
        />
      </div>
      <div className="w-full h-full flex flex-col">
        <p className="text-sm">{props.service.name}</p>
        <p className="text-xs text-gray-500">{props.service.description}</p>
      </div>
      <div className="w-full flex justify-end items-center gap-2">
        <Checkbox
          isSelected={changeServiceCost}
          onChange={() => setChangeServiceCost(!changeServiceCost)}
          radius="sm"
        >
          Modificar precio
        </Checkbox>
        <TextComponent
          name="service_cost"
          type="text"
          value={
            changeServiceCost
              ? price
              : (props.service as any)[
                  `price_for_${props.vehicleType.toLowerCase()}`
                ].toString()
          }
          onKeyDown={handleServiceCostChange}
        />
      </div>
    </div>
  );
}
