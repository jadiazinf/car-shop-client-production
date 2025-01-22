import { ReactNode, useEffect, useReducer } from "react";
import { ToasterContext } from "./context/context";
import toast, { Toaster } from "react-hot-toast";
import { makeToastReducer } from "./reducer/reducer";
import { CiCircleInfo } from "react-icons/ci";

export const ToasterProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(makeToastReducer, []);

  useEffect(() => {
    state.forEach(({ message, type }) => {
      if (type === "SUCCESS") {
        toast.success(message);
      } else if (type === "ERROR") {
        toast.error(message);
      } else if (type === "INFO") {
        toast(() => (
          <span className="flex items-center gap-2">
            <CiCircleInfo className="w-10 h-10" />
            <p>{message}</p>
          </span>
        ));
      }
    });

    if (state.length > 0) {
      dispatch({ type: "CLEAR" });
    }
  }, [state]);

  return (
    <ToasterContext.Provider value={{ messages: state, dispatch }}>
      <Toaster />
      {props.children}
    </ToasterContext.Provider>
  );
};
