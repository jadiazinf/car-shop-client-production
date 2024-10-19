import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import GetAllUsersCompaniesRequestsService from "./get_all_requests";
import { UserCompanyRequestStatus } from "../../types";
import { PaginatedData } from "../../../../helpers/application_response/types";
import UserCompanyRequestModel from "../../model";

export type GetAllUserCompaniesRequestsProps = {
  payload: PaginatedData<UserCompanyRequestModel>;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetAllUserCompaniesRequests() {

  const [ payloadState, setPayloadState ] = useState<GetAllUserCompaniesRequestsProps | "not loaded">("not loaded");

  const [ isGettingAllUsersCompaniesRequestsLoading, setIsGettingAllUsersCompaniesRequestsLoading ] = useState<boolean>(false);

  async function performGetAllUsersCompaniesRequests(data: {page_number: number, status: UserCompanyRequestStatus}, callback?: (data: GetAllUserCompaniesRequestsProps) => void) {
    setIsGettingAllUsersCompaniesRequestsLoading(true);
    const service = new GetAllUsersCompaniesRequestsService();
    await service.perform({page_number: data.page_number, status: data.status});
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingAllUsersCompaniesRequestsLoading(false);
  }

  return {
    isGettingAllUsersCompaniesRequestsLoading,
    performGetAllUsersCompaniesRequests,
    payloadState
  };
}

export default useGetAllUserCompaniesRequests;
