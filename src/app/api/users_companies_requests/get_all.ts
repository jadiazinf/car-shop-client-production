import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import UserCompanyRequestModel from "../../../entities/user_company_request/model";
import { PaginatedData } from "../../../helpers/application_response/types";

type ErrorResponse = {
  errors: string[];
};

export function getAllUserCompanyRequest() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<UserCompanyRequestModel> | ErrorResponse
  > | null>(null);
  const [isGettingRequests, setIsGettingRequests] =
    useState(false);

  async function perform(company_id: number, token: string, filters: {name?: string, rif?: string, status?: string, page?: number}) {
    try {
      setIsGettingRequests(true);

      const response = await api.get<PaginatedData<UserCompanyRequestModel> | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/users_companies_requests?company_id=${company_id}${filters ? `&${new URLSearchParams(Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)).toString()}` : ''}`,
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
      setIsGettingRequests(false);
    }
  }

  return {
    perform,
    isGettingRequests,
    getAllUserCompanyRequestResponse: response,
  };
}
