import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CompanyRequestModel from "../../model";
import GetAllCompaniesRequestsService from "./get_all_requests";

export type GetAllCompaniesRequestsProps = {
  payload: CompanyRequestModel[];
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetAllCompaniesRequests() {

  const [ payloadState, setPayloadState ] = useState<GetAllCompaniesRequestsProps | "not loaded">("not loaded");

  const [ isGettingAllCompaniesRequestsLoading, setIsGettingAllCompaniesRequestsLoading ] = useState<boolean>(false);

  async function performGetAllCompaniesRequests(callback?: (data: GetAllCompaniesRequestsProps) => void) {
    setIsGettingAllCompaniesRequestsLoading(true);
    const service = new GetAllCompaniesRequestsService();
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingAllCompaniesRequestsLoading(false);
  }

  return {
    isGettingAllCompaniesRequestsLoading,
    performGetAllCompaniesRequests,
    payloadState
  };
}

export default useGetAllCompaniesRequests;
