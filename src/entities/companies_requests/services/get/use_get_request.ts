import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CompanyRequestModel from "../../model";
import GetCompanyRequestService from "./get_request";

export type GetCompanyRequestProps = {
  payload: CompanyRequestModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetCompanyRequest() {

  const [ payloadState, setPayloadState ] = useState<GetCompanyRequestProps | "not loaded">("not loaded");

  const [ isGettingCompanyRequestLoading, setIsGettingCompanyRequestLoading ] = useState<boolean>(false);

  async function performGetCompanyRequest(data: {request_id: number}, callback?: (data: GetCompanyRequestProps) => void) {
    setIsGettingCompanyRequestLoading(true);
    const service = new GetCompanyRequestService({request_id: data.request_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingCompanyRequestLoading(false);
  }

  return {
    isGettingCompanyRequestLoading,
    performGetCompanyRequest,
    payloadState
  };
}

export default useGetCompanyRequest;
