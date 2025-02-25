import { Input } from "@heroui/react";
import { IBaseInputProps } from "./interfaces";

function TextComponent(props: IBaseInputProps) {
  return (
    <Input
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      className='w-full'
      variant={props.variant || 'underlined'}
      type={props.type}
      label={props.label}
      placeholder={props.placeholder}
      errorMessage={props.errorMessage}
      isInvalid={props.isError}
      startContent={props.startContent}
      endContent={props.endContent}
      onBlur={props.onBlur}
      radius="sm"
      isDisabled={props.isDisabled}
      onKeyDown={props.onKeyDown}
    />
  );
}

export default TextComponent;
