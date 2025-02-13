import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import UserCompanyRequestModel from "../../../entities/user_company_request/model";

type ErrorResponse = {
  errors: string[];
};

export function getUserCompanyRequest() {
  const [response, setResponse] = useState<ApiResponse<
    UserCompanyRequestModel | ErrorResponse
  > | null>(null);
  const [isGettingUserCompanyRequest, setIsGettingUserCompanyRequest] =
    useState(false);

  async function perform(user_company_request_id: number, token: string) {
    try {
      setIsGettingUserCompanyRequest(true);

      const response = await api.get<UserCompanyRequestModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/users_companies_requests/${user_company_request_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse({
        data: response.data,
        status: response.status as StatusCodes,
      });
      return {
        data: response.data,
        status: response.status as StatusCodes,
      };
    } catch (error) {
      return {
        data: {
          errors: ((error as AxiosError).response!.data as { errors: string[] })
            .errors! as string[],
        },
        status: (error as any).status,
      };
    } finally {
      setIsGettingUserCompanyRequest(false);
    }
  }

  return {
    perform,
    isGettingUserCompanyRequest,
    getUserCompanyRequestResponse: response,
  };
}
