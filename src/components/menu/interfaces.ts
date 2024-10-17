export interface IMenuContextProps {
  actualMenuOption: string;
  isOpen: boolean;
  toggleMenu: () => void;
  setOption: (option: string) => void;
}
