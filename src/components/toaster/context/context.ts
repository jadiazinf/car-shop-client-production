import { createContext } from "react";
import { ToasterContextProps } from "./types";

export const ToasterContext = createContext<ToasterContextProps>({} as ToasterContextProps);
