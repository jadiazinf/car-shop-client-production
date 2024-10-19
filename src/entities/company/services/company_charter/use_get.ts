import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import GetCompanyCharterService from "./get";

export type GetCompanyCharterProps = {
  payload: Blob | null;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetCompanyCharter() {

  const [ payloadState, setPayloadState ] = useState<GetCompanyCharterProps | "not loaded">("not loaded");

  const [ isGettingCompanyCharterLoading, setIsGettingCompanyCharterLoading ] = useState<boolean>(false);

  async function performGetCompanyCharter(data: {company_id: number}, callback?: (data: GetCompanyCharterProps) => void) {
    setIsGettingCompanyCharterLoading(true);
    const service = new GetCompanyCharterService({company_id: data.company_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingCompanyCharterLoading(false);
  }

  return {
    isGettingCompanyCharterLoading,
    performGetCompanyCharter,
    payloadState
  };
}

export default useGetCompanyCharter;
