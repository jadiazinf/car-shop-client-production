import { useContext, useEffect } from "react";
import WindowLoader from "../../../components/window/loader";
import { useDispatch, useSelector } from "react-redux";
import { Deauthenticate } from "../../../store/auth/reducers";
import useLogoutService, { LogoutServiceData } from '../../../auth/services/logout/use_logout';
import { RootState } from "../../../store/store";
import { PersistedStore } from "../../../store/types";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../components/toaster/context/context";

function LogoutPage(){

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const appDispatch = useDispatch();

  const { authReducer } = useSelector((state: RootState):PersistedStore => state.persistedReducer);

  const { performLogout } = useLogoutService();

  function handler(data: LogoutServiceData) {
    console.log(data);
    if (data.status !== StatusCodes.OK) {
      toasterDispatch({payload: data.errorMessage || "Error al cerrar sesión", type: 'ERROR'});
      return;
    }
    appDispatch(Deauthenticate());
    toasterDispatch({payload: "Sesión cerrada exitosamente", type: "SUCCESS"});
  }

  async function handleLogout() {
    performLogout({token: authReducer.token!}, handler);
  }

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <WindowLoader />
  );
}

export default LogoutPage;
