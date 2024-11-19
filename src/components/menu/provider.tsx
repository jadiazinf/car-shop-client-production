import { ReactNode, useState } from "react";
import MenuContext from "./context";

function MenuProvider(props: { children: ReactNode }) {

  const [ state, setState ] = useState<boolean>(false);

  function toggleMenu() {
    setState(!state);
  }

  function openMenu() {
    setState(true);
  }

  function closeMenu() {
    setState(false);
  }

  return (
    <MenuContext.Provider value={{isMenuOpenState: state, setMenuOpenState: setState, toggleMenu, closeMenu, openMenu}}>
      { props.children }
    </MenuContext.Provider>
  );
}

export default MenuProvider;
