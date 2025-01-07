import { useNavigate } from "react-router-dom";
import WindowLoader from "../../components/window/loader";
import { UserCompanyRole } from "../../entities/users_companies/types";
import { usePersistedStore } from "../../store/store";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Deauthenticate, SetAuthentication } from "../../store/auth/reducers";
import { useUsersApiServices } from "../api/users";
import { ToasterContext } from "../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";

function UserSessionPage() {
  const { sessionType, status } = usePersistedStore().authReducer;

  const { perform } = useUsersApiServices.getNewToken();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const [finishedFlag, setFinishedFlag] = useState(false);

  const navigate = useNavigate();

  const reduxDispatch = useDispatch();

  async function handleRefreshToken() {
    const response = await perform(sessionType!.user.id as number);
    if (
      response.status === StatusCodes.BAD_REQUEST ||
      response.status === StatusCodes.CONFLICT
    ) {
      toasterDispatch({
        payload:
          response.data?.errorMessage ||
          "Ha ocurrido un error, por favor inicie sesión nuevamente",
        type: "ERROR",
      });
      reduxDispatch(Deauthenticate());
    }

    if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
      toasterDispatch({
        payload: "Ha ocurrido un error, por favor intente más tarde",
        type: "ERROR",
      });
      reduxDispatch(Deauthenticate());
    }

    if (response.status === StatusCodes.OK)
      reduxDispatch(
        SetAuthentication({ sessionType, status, token: response.data?.token })
      );

    setFinishedFlag(true);
  }

  useEffect(() => {
    if (
      sessionType?.roles?.some((role) =>
        [
          UserCompanyRole.ADMIN,
          UserCompanyRole.SUPERADMIN,
          UserCompanyRole.TECHNICIAN,
        ].includes(role)
      )
    ) {
      reduxDispatch(Deauthenticate());
      navigate("/");
    } else handleRefreshToken();
  }, []);

  useEffect(() => {
    if (finishedFlag) navigate("/");
  }, [finishedFlag]);

  return <WindowLoader message="Cargando, espere un momento" />;
}

export default UserSessionPage;
