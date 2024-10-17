import { createContext } from 'react';
import { IMenuContextProps } from './interfaces';

const MenuContext = createContext<IMenuContextProps>({
  actualMenuOption: 'Home',
  isOpen: false,
  toggleMenu: () => {},
  setOption: () => {}
});

export default MenuContext;
