import { RiEBikeLine } from "react-icons/ri";
import ServiceModel from "../../model";
import { FaCar } from "react-icons/fa";
import { FaTruckField, FaTruckFront } from "react-icons/fa6";

type Props = { service: ServiceModel };

export default function ServicePricesComponent(props: Props) {
  return (
    <div className="flex flex-col">
      {props.service.price_for_motorbike && (
        <div className="flex gap-2 items-center">
          <RiEBikeLine className="text-black text-opacity-40 w-5 h-5" />
          <p className="text-sm">{`${(
            props.service.price_for_motorbike as number
          ).toFixed(2)} REF`}</p>
        </div>
      )}
      {props.service.price_for_car && (
        <div className="flex gap-2 items-center">
          <FaCar className="text-black text-opacity-40 w-4 h-4" />
          <p className="text-sm">{`${(
            props.service.price_for_car as number
          ).toFixed(2)} REF`}</p>
        </div>
      )}
      {props.service.price_for_van && (
        <div className="flex gap-2 items-center">
          <FaTruckField className="text-black text-opacity-40 w-5 h-5" />
          <p className="text-sm">{`${(
            props.service.price_for_van as number
          ).toFixed(2)} REF`}</p>
        </div>
      )}
      {props.service.price_for_truck && (
        <div className="flex gap-2 items-center">
          <FaTruckFront className="text-black text-opacity-40 w-5 h-5" />
          <p className="text-sm">{`${(
            props.service.price_for_truck as number
          ).toFixed(2)} REF`}</p>
        </div>
      )}
    </div>
  );
}
