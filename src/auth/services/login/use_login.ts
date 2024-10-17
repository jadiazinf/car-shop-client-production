import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import { AxiosResponseHeaders } from "axios";
import LoginService from "./login";
import UserModel from "../../../entities/user/model";

export type LoginServiceData = {
  payload: UserModel;
  headers: AxiosResponseHeaders;
  errorMessage: string | null;
  status: StatusCodes;
  token: string | null;
}

function useLoginService() {

  const [ isLoginLoading, setIsLoginLoading ] = useState<boolean>(false);

  async function performLogin(form: {email: string; password: string;}, callback: (data: LoginServiceData) => void) {
    setIsLoginLoading(true);
    const service = new LoginService(form);
    await service.perform();
    const data = {
      payload: service.payload,
      headers: service.headers,
      errorMessage: service.errorMessage,
      status: service.status,
      token: service.token,
    };
    callback(data);
    setIsLoginLoading(false);
  }

  return {
    isLoginLoading,
    performLogin,
  };
}

export default useLoginService;
