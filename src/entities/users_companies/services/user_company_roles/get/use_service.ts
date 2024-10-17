import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import { UserCompanyRole } from "../../../types";
import GetUserCompanyRoles from "./service";

export type GetUserCompanyRolesProps = {
  payload: UserCompanyRole[];
  errorMessage: string | null;
  status: StatusCodes;
  token: string | null;
}

function useGetUserCompanyRolesService() {

  const [ payloadState, setPayloadState ] = useState<GetUserCompanyRolesProps | "not loaded">("not loaded");

  const [ isGettingUserCompanyRolesLoading, setIsGettingUserCompanyRolesLoading ] = useState<boolean>(false);

  async function performGetRole(data: {company_id: number; token: string}, callback?: (data: GetUserCompanyRolesProps) => void) {
    setIsGettingUserCompanyRolesLoading(true);
    const service = new GetUserCompanyRoles({ company_id: data.company_id, token: data.token});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
      token: service.token,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingUserCompanyRolesLoading(false);
  }

  return {
    isGettingUserCompanyRolesLoading,
    performGetRole,
    payloadState
  };
}

export default useGetUserCompanyRolesService;
