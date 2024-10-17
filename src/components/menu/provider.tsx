import { ReactNode, useState } from "react";
import MenuContext from './context';

export const MenuProvider = (props: { children: ReactNode }) => {

  const [actualMenuOption, setActualMenuOption] = useState<string>('Home');

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const setOption = (option: string) => {
    setActualMenuOption(option);
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  return (
    <MenuContext.Provider value={{actualMenuOption, setOption, isOpen, toggleMenu}}>
      { props.children }
    </MenuContext.Provider>
  );

}
