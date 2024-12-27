import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import { UserCompanyModel } from "../../model";
import GetUsersFromCompany from "./service";
import { PaginatedData } from "../../../../helpers/application_response/types";

export type GetUsersFromCompanyProps = {
  payload: PaginatedData<UserCompanyModel>;
  errorMessage: string | null;
  status: StatusCodes;
  token: string;
};

function useGetUsersFromCompanyService() {
  const [payloadState, setPayloadState] = useState<
    GetUsersFromCompanyProps | "not loaded"
  >("not loaded");

  const [
    isGettingUsersFromCompanyLoading,
    setIsGettingUsersFromCompanyLoading,
  ] = useState<boolean>(false);

  async function performGetUsersFromCompany(
    data: {
      company_id: number;
      token: string;
      page_number: number;
      name?: string;
    },
    callback?: (data: GetUsersFromCompanyProps) => void
  ) {
    setIsGettingUsersFromCompanyLoading(true);
    const service = new GetUsersFromCompany({
      company_id: data.company_id,
      token: data.token,
    });
    await service.perform({ page_number: data.page_number, name: data.name });
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
      token: service.token || "",
    };
    setPayloadState(response);
    callback && callback(response);
    setIsGettingUsersFromCompanyLoading(false);
  }

  return {
    isGettingUsersFromCompanyLoading,
    performGetUsersFromCompany,
    payloadState,
  };
}

export default useGetUsersFromCompanyService;
