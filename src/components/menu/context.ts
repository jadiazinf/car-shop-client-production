import { createContext } from "react";

interface IMenuContextProps {
  isMenuOpenState: boolean;
  setMenuOpenState: React.Dispatch<boolean>;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

const MenuContext = createContext<IMenuContextProps>({} as IMenuContextProps);

export default MenuContext;
