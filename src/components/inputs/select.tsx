import { Select, SelectItem } from "@nextui-org/react";
import { IBaseSelectProps } from "./interfaces";

function SelectComponent(props: IBaseSelectProps) {
  return (
    <Select
      radius="sm"
      label={props.label}
      className='w-full'
      variant='underlined'
      selectedKeys={[props.value]}
      onChange={props.onChange}
      startContent={props.startContent}
      endContent={props.endContent}
      onBlur={props.onBlur}
      errorMessage={props.errorMessage}
      isInvalid={props.isError}
      isDisabled={props.isDisabled}
      name={props.name}
      key={props.key}
    >
      {
        props.data.map( element => (
          <SelectItem key={element.key}>
            {element.label}
          </SelectItem>
        ) )
      }
    </Select>
  );
}

export default SelectComponent;
