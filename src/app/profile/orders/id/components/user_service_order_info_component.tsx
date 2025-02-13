import { Button } from "@nextui-org/react";
import { ServiceOrderHelpers } from "../../../../../entities/service_order/helpers";
import {
  ServiceOrderModel,
  ServiceOrderStatus,
} from "../../../../../entities/service_order/model";
import { useNavigate } from "react-router-dom";

type Props = {
  service_order: ServiceOrderModel;
};

export function UserServiceOrderInfoComponent(props: Props) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex justify-between items-center">
      <div className="w-full flex gap-2 items-center">
        <p className="font-semibold text-xl">
          {props.service_order.service?.name || ""}
        </p>
        <p className="text-black text-opacity-50">
          {`(${props.service_order.service?.description || ""})`}
        </p>
      </div>
      <div className="w-full flex gap-5 items-center justify-end">
        {props.service_order.status !==
          ServiceOrderStatus.PENDING_FOR_QUOTE_APPROVEMENT && (
          <>
            <div className="flex gap-2 items-center">
              <div className="w-auto">
                <Button
                  type="button"
                  variant="light"
                  onClick={() =>
                    navigate(
                      `/profile/orders/advances/${props.service_order.id!}/${
                        props.service_order.order_id
                      }/${props.service_order.order!.company_id!}`
                    )
                  }
                >
                  Avances
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <p>
                  {ServiceOrderHelpers.translateServiceOrderStatus(
                    props.service_order
                  )}
                </p>
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col justify-end items-center">
          <div className="flex gap-2 items-center">
            <p>{`${Number(props.service_order.cost).toFixed(2)} REF`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
