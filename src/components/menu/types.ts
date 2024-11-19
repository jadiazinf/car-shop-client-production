import { ReactNode } from "react";

export type MenuChildrenProps = {
  children?: MenuOptions[];
}

export type MenuOptions = {
  name: string;
  icon: ReactNode;
  url?: string;
  children?: MenuOptions[];
}

export type MenuOptionsProps = MenuOptions;
