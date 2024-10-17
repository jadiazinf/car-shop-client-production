import { ReactNode, useEffect, useReducer } from "react";
import { ToasterContext } from "./context/context";
import toast, { Toaster } from "react-hot-toast";
import { makeToastReducer } from "./reducer/reducer";

export const ToasterProvider = (props: { children: ReactNode }) => {

  const [state, dispatch] = useReducer(makeToastReducer, { message: "", type: "CLEAR"});

  useEffect(() => {
    if (state.type === "SUCCESS")
      toast.success(state.message);
    if (state.type === "ERROR")
      toast.error(state.message);
  }, [state]);

  return (
    <ToasterContext.Provider value={{ message: state.message, dispatch }}>
      <Toaster />
      {props.children}
    </ToasterContext.Provider>
  )
}
