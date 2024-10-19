import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CompanyRequestModel from "../../model";
import GetUserCompanyRequestService from "./get_request";

export type GetUserCompanyRequestProps = {
  payload: CompanyRequestModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetUserCompanyRequest() {

  const [ payloadState, setPayloadState ] = useState<GetUserCompanyRequestProps | "not loaded">("not loaded");

  const [ isGettingUserCompanyRequestLoading, setIsGettingUserCompanyRequestLoading ] = useState<boolean>(false);

  async function performGetUserCompanyRequest(data: {request_id: number}, callback?: (data: GetUserCompanyRequestProps) => void) {
    setIsGettingUserCompanyRequestLoading(true);
    const service = new GetUserCompanyRequestService({request_id: data.request_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingUserCompanyRequestLoading(false);
  }

  return {
    isGettingUserCompanyRequestLoading,
    performGetUserCompanyRequest,
    payloadState
  };
}

export default useGetUserCompanyRequest;
