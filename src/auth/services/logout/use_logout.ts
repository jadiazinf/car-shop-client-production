import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import LogoutService from "./logout";

export type LogoutServiceData = {
  errorMessage: string | null;
  status: StatusCodes;
  token: string | null;
}

function useLogoutService() {

  const [ isLogoutLoading, setIsLogoutLoading ] = useState<boolean>(false);

  async function performLogout(data: {token: string}, callback: (data: LogoutServiceData) => void) {
    setIsLogoutLoading(true);
    const service = new LogoutService({ token: data.token });
    await service.perform();
    const response = {
      errorMessage: service.errorMessage,
      status: service.status,
      token: service.token,
    };
    callback(response);
    setIsLogoutLoading(false);
  }

  return {
    isLogoutLoading,
    performLogout,
  };
}

export default useLogoutService;
