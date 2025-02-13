import { ServiceOrderModel } from "../model";

type Props = {
  service_order: ServiceOrderModel;
};

export function ServiceOrderInfoComponent(props: Props) {
  return (
    <div className="w-full h-full flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <p className="font-semibold text-xl">
          {props.service_order.service?.name || ""}
        </p>
        <p className="text-black text-opacity-50">
          {`(${props.service_order.service?.description || ""})`}
        </p>
      </div>
      <div className="flex flex-col justify-end items-center">
        <p>{`${props.service_order.cost} REF`}</p>
      </div>
    </div>
  );
}
