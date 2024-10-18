import { createContext } from "react";
import { MakeToastReducerActionType, ToastMessage } from "../reducer/types";

export type ToasterContextProps = {
  messages: ToastMessage[];
  dispatch: React.Dispatch<MakeToastReducerActionType>;
}

export const ToasterContext = createContext<ToasterContextProps>({
  messages: [],
  dispatch: () => {},
});
