import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import { PaginatedData } from "../../../../../helpers/application_response/types";
import UserCompanyRequestModel from "../../../model";
import { UserCompanyRequestStatus } from "../../../types";
import GetUserCompanyRequestsByCompanyService from "./get_by_company";

export type GetUserCompaniesRequestsByCompanyProps = {
  payload: PaginatedData<UserCompanyRequestModel>;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetUserCompanyRequestsByCompany() {

  const [ payloadState, setPayloadState ] = useState<GetUserCompaniesRequestsByCompanyProps | "not loaded">("not loaded");

  const [ isGettingUserCompanyRequestsByCompanyLoading, setIsGettingUserCompanyRequestsByCompanyLoading ] = useState<boolean>(false);

  async function performGetUserCompanyRequestsByCompany(data: {page_number: number, status: UserCompanyRequestStatus, token: string; company_id: number}, callback?: (data: GetUserCompaniesRequestsByCompanyProps) => void) {
    setIsGettingUserCompanyRequestsByCompanyLoading(true);
    const service = new GetUserCompanyRequestsByCompanyService({token: data.token, company_id: data.company_id});
    await service.perform({page_number: data.page_number, status: data.status});
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingUserCompanyRequestsByCompanyLoading(false);
  }

  return {
    isGettingUserCompanyRequestsByCompanyLoading,
    performGetUserCompanyRequestsByCompany,
    payloadState
  };
}

export default useGetUserCompanyRequestsByCompany;
