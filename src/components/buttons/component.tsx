import { Button } from "@nextui-org/react";
import { IButtonComponentProps } from "./interfaces";

function ButtonComponent(props: IButtonComponentProps) {
  return (
    <Button
      className='w-full'
      type={props.type}
      variant={props.variant}
      onClick={props.onClick}
      isLoading={props.isLoading || false}
      radius='sm'
      color={props.color}
      startContent={props.startContent}
      endContent={props.endContent}
      isDisabled={props.isDisabled}
    >
      { props.text }
    </Button>
  );
}

export default ButtonComponent;
