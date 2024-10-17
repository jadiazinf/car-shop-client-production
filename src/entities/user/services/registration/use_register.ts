import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import UserModel from "../../model";
import RegisterUserService from "./register";

export type RegisterUserProps = {
  payload: UserModel;
  errorMessage: string | null;
  status: StatusCodes;
  token: string | null;
}

function useRegisterUser() {

  const [ payloadState, setPayloadState ] = useState<RegisterUserProps | "not loaded">("not loaded");

  const [ isRegisteringUserLoading, setIsRegiteringUserLoading ] = useState<boolean>(false);

  async function performRegisterUser(data: {user: UserModel}, callback?: (data: RegisterUserProps) => void) {
    setIsRegiteringUserLoading(true);
    const service = new RegisterUserService({ user: data.user });
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
      token: service.token,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsRegiteringUserLoading(false);
  }

  return {
    isRegisteringUserLoading,
    performRegisterUser,
    payloadState
  };
}

export default useRegisterUser;
