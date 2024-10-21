import { Input } from "@nextui-org/react";
import LocationModel from "../model";

type IPlaceComponentProps = {
  country: LocationModel;
  state: LocationModel;
  city: LocationModel;
  town: LocationModel;
  direction?: 'vertical' | 'horizontal'
};

function PlaceComponent(props: IPlaceComponentProps) {

  function getDirectionValue() {
    if (props.direction === 'vertical')
      return 'flex-col';
    else
      return 'flex-row';
  }

  return (
    <div className={`w-full flex gap-3 ${props.direction ? getDirectionValue() : 'flex-col md:flex-row'}`}>
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
