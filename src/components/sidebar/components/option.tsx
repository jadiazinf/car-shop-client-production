import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type SidebarOptions = {
  name: string;
  url: string;
  icon: ReactNode;
  urlStartsWithForActive?: boolean;
}

function SidebarOption(props: SidebarOptions) {

  const { pathname } = useLocation();

  const navigate = useNavigate();

  function isActive() {
    if (props.urlStartsWithForActive)
      return pathname.startsWith(props.url);
    return pathname === props.url
  }

  function handleClick() {
    navigate(props.url);
  }

  return (
    <div
      className={`w-full flex gap-3 items-center text-black cursor-pointer py-1 pl-2 rounded-lg hover:bg-slate-500 hover:bg-opacity-20 transition-all duration-200 ease-in-out ${isActive() ? "bg-slate-500 bg-opacity-10" : "text-opacity-50"}`}
      onClick={handleClick}
    >
      { props.icon }
      <p>{ props.name }</p>
    </div>
  );
}

export default SidebarOption;
