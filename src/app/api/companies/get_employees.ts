import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { UserCompanyModel } from "../../../entities/users_companies/model";
import { PaginatedData } from "../../../helpers/application_response/types";

type ErrorResponse = {
  errors: string[];
};

export function getEmployees() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<UserCompanyModel> | ErrorResponse
  > | null>(null);
  const [isGettingEmployees, setIsGettingEmployees] = useState(false);

  async function perform(company_id: number, page: number, token: string) {
    try {
      setIsGettingEmployees(true);
      const response = await api.get<PaginatedData<UserCompanyModel>>(
        `${API_BASE_ROUTE_EXTENSION}/companies/${company_id}/company_employees?page=${page}`,
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
      setIsGettingEmployees(false);
    }
  }

  return {
    perform,
    isGettingEmployees,
    getEmployeesResponse: response,
  };
}
