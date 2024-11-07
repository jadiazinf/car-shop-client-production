import { BoxIconProps } from "./types";

function BoxIconComponent(props: BoxIconProps) {
  return (
    <div
      className={`w-14 flex justify-center items-center p-3 text-black rounded-md`}
      style={{backgroundColor: props.bgColor}}
    >
      { props.icon }
    </div>
  );
}

export default BoxIconComponent
