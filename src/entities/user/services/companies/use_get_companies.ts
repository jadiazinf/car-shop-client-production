import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import GetUserCompanies from "./get_companies";
import { UserCompanyModel } from "../../../users_companies/model";

export type GetUserCompaniesProps = {
  payload: UserCompanyModel[];
  errorMessage: string | null;
  status: StatusCodes;
  token: string | null;
};

function useGetUserCompanies() {
  const [payloadState, setPayloadState] = useState<
    GetUserCompaniesProps | "not loaded"
  >("not loaded");

  const [isGettingUserCompaniesLoading, setIsGettingUserCompaniesLoading] =
    useState<boolean>(false);

  async function performGetUserCompanies(
    data: { token: string },
    callback?: (data: GetUserCompaniesProps) => void
  ) {
    setIsGettingUserCompaniesLoading(true);
    const service = new GetUserCompanies({
      token: data.token,
    });
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
      token: service.token,
    };
    setPayloadState(response);
    callback && callback(response);
    setIsGettingUserCompaniesLoading(false);
  }

  return {
    isGettingUserCompaniesLoading,
    performGetUserCompanies,
    payloadState,
  };
}

export default useGetUserCompanies;
