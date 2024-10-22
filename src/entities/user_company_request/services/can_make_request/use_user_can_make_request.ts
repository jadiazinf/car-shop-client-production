import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CanUserMakeRequestService from "./user_can_make_request";

export type CanUserMakeRequestProps = {
  payload: boolean;
  errorMessage: string | null;
  status: StatusCodes;
}

function useCanUserMakeRequest() {

  const [ payloadState, setPayloadState ] = useState<CanUserMakeRequestProps | "not loaded">("not loaded");

  const [ isGettingUserPermissionToRequestLoading, setIsGettingUserPermissionToRequestLoading ] = useState<boolean>(false);

  async function performCanUserMakeRequest(data: {company_id: number, user_id: number, token: string}, callback?: (data: CanUserMakeRequestProps) => void) {
    setIsGettingUserPermissionToRequestLoading(true);
    const service = new CanUserMakeRequestService({company_id: data.company_id, token: data.token, user_id: data.user_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingUserPermissionToRequestLoading(false);
  }

  return {
    isGettingUserPermissionToRequestLoading,
    performCanUserMakeRequest,
    payloadState
  };
}

export default useCanUserMakeRequest;
