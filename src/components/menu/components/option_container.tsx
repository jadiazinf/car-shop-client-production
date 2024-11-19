import { ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuContext from "../context";

type Props = {
  url: string;
  name: string;
  icon: ReactNode;
}

function MenuOptionContainer(props: Props) {

  const { closeMenu } = useContext(MenuContext);

  const pathname = useLocation().pathname;

  const navigate = useNavigate();

  function handleClick() {
    if (props.url) {
      navigate(props.url);
      closeMenu();
    }
  }

  return (
    <div
      className={`text-lg flex items-center gap-2 cursor-pointer bg-black hover:bg-opacity-50 transition-all ease-in-out duration-300 w-full px-2 py-1 rounded-md ${props.url && pathname === props.url ? 'bg-opacity-10' : 'bg-opacity-0 text-black'}`}
      onClick={handleClick}
    >
      { props.icon }
      <p>{ props.name }</p>
    </div>
  );
}

export default MenuOptionContainer;
