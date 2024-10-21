import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import { ErrorsMessage } from "../../../../helpers/application_response/types";
import CompanyModel from "../../model";
import UpdateCompanyService from "./update";

export type UpdateCompanyProps = {
  payload: CompanyModel | ErrorsMessage | null;
  errorMessage: string | null;
  status: StatusCodes;
}

function useUpdateUserCompanyRequest() {

  const [ payloadState, setPayloadState ] = useState<UpdateCompanyProps | "not loaded">("not loaded");

  const [ isUpdatingCompanyLoading, setIsUpdatingCompanyLoading ] = useState<boolean>(false);

  async function performUpdateUserCompanyRequest(data: {company: any, company_id: number, token: string}, callback?: (data: UpdateCompanyProps) => void) {
    setIsUpdatingCompanyLoading(true);
    const service = new UpdateCompanyService({company: data.company, company_id: data.company_id, token: data.token});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsUpdatingCompanyLoading(false);
  }

  return {
    isUpdatingCompanyLoading,
    performUpdateUserCompanyRequest,
    payloadState
  };
}

export default useUpdateUserCompanyRequest;
