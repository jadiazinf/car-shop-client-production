import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import UpdateUserCompanyRequestService, { UpdateRequestResponse, UpdateUserCompanyRequest } from "./update";

export type UpdateUserCompanyRequestProps = {
  payload: UpdateRequestResponse | string | null;
  errorMessage: string | null;
  status: StatusCodes;
}

function useUpdateUserCompanyRequest() {

  const [ payloadState, setPayloadState ] = useState<UpdateUserCompanyRequestProps | "not loaded">("not loaded");

  const [ isUpdatingUserCompanyRequestLoading, setIsUpdatingUserCompanyRequestLoading ] = useState<boolean>(false);

  async function performUpdateUserCompanyRequest(data: {request: UpdateUserCompanyRequest, user_company_request_id: number, company_id: number}, callback?: (data: UpdateUserCompanyRequestProps) => void) {
    setIsUpdatingUserCompanyRequestLoading(true);
    const service = new UpdateUserCompanyRequestService({request: data.request, user_company_request_id: data.user_company_request_id, company_id: data.company_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsUpdatingUserCompanyRequestLoading(false);
  }

  return {
    isUpdatingUserCompanyRequestLoading,
    performUpdateUserCompanyRequest,
    payloadState
  };
}

export default useUpdateUserCompanyRequest;
