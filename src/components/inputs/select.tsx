import { Select, SelectItem } from "@heroui/react";
import { IBaseSelectProps } from "./interfaces";

function SelectComponent(props: IBaseSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Select
        radius="sm"
        label={props.label}
        className="w-full"
        variant={props.variant ? props.variant : "underlined"}
        selectedKeys={[props.value]}
        onChange={props.onChange}
        startContent={props.startContent}
        endContent={props.endContent}
        onBlur={props.onBlur}
        errorMessage={props.errorMessage}
        isInvalid={props.isError}
        isDisabled={props.isDisabled}
        name={props.name}
        size={props.size ? props.size : "lg"}
        disallowEmptySelection={props.disallowEmptySelection}
      >
        {props.data.map((element) => (
          <SelectItem key={element.key}>{element.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

export default SelectComponent;
