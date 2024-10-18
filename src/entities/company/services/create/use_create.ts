import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CompanyModel from "../../model";
import CreateCompanyService from "./create_service";

export type CreateCompanyProps = {
  payload: CompanyModel;
  errorMessage: string | null;
  status: StatusCodes;
  token: string | null;
}

function useCreateCompany() {

  const [ payloadState, setPayloadState ] = useState<CreateCompanyProps | "not loaded">("not loaded");

  const [ isCreatingCompanyLoading, setIsCreatingCompanyLoading ] = useState<boolean>(false);

  async function performCreateCompany(data: {company: CompanyModel, token: string, user_id: number}, callback?: (data: CreateCompanyProps) => void) {
    setIsCreatingCompanyLoading(true);
    const service = new CreateCompanyService({ company: data.company, token: data.token, user_id: data.user_id });
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
      token: service.token,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsCreatingCompanyLoading(false);
  }

  return {
    isCreatingCompanyLoading,
    performCreateCompany,
    payloadState
  };
}

export default useCreateCompany;
