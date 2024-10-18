import { ReactNode, useEffect, useReducer } from "react";
import { ToasterContext } from "./context/context";
import toast, { Toaster } from "react-hot-toast";
import { makeToastReducer } from "./reducer/reducer";

export const ToasterProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(makeToastReducer, []);

  useEffect(() => {
    state.forEach(({ message, type }) => {
      if (type === "SUCCESS") {
        toast.success(message);
      } else if (type === "ERROR") {
        toast.error(message);
      }
    });

    if (state.length > 0) {
      dispatch({ type: 'CLEAR' });
    }
  }, [state]);

  return (
    <ToasterContext.Provider value={{ messages: state, dispatch }}>
      <Toaster />
      {props.children}
    </ToasterContext.Provider>
  );
}
