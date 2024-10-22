import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CompanyRequestModel from "../../model";
import GetCompanyService from "./get_company";

export type GetCompanyProps = {
  payload: CompanyRequestModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetCompany() {

  const [ payloadState, setPayloadState ] = useState<GetCompanyProps | "not loaded">("not loaded");

  const [ isGettingCompanyLoading, setIsGettingCompanyLoading ] = useState<boolean>(false);

  async function performGetCompany(data: {company_id: number, token: string}, callback?: (data: GetCompanyProps) => void) {
    setIsGettingCompanyLoading(true);
    const service = new GetCompanyService({company_id: data.company_id, token: data.token});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingCompanyLoading(false);
  }

  return {
    isGettingCompanyLoading,
    performGetCompany,
    payloadState
  };
}

export default useGetCompany;
