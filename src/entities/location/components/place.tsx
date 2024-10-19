import { Input } from "@nextui-org/react";
import LocationModel from "../model";

type IPlaceProps = {
  country: LocationModel;
  state: LocationModel;
  city: LocationModel;
  town: LocationModel;
};

function PlaceComponent(props: IPlaceProps) {

  return (
    <div className='w-full flex flex-col md:flex-row gap-3'>
      <Input
        key="country"
        type="text"
        label="País"
        labelPlacement="outside"
        isDisabled
        variant="bordered"
        radius='sm'
        value={props.country.name}
      />
      <Input
        key="state"
        type="text"
        label="Estado"
        labelPlacement="outside"
        isDisabled
        variant="bordered"
        radius='sm'
        value={props.state.name}
      />
      <Input
        key="city"
        type="text"
        label="Ciudad"
        labelPlacement="outside"
        isDisabled
        variant="bordered"
        radius='sm'
        value={props.city.name}
      />
      <Input
        key="town"
        type="text"
        label="Municipio"
        labelPlacement="outside"
        isDisabled
        variant="bordered"
        radius='sm'
        value={props.town.name}
      />
    </div>
  );
}

export default PlaceComponent;
