import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { UserCompanyModel } from "../../../entities/users_companies/model";
import { UserCompanyRole } from "../../../entities/users_companies/types";

type ErrorResponse = {
  errors: string[];
};

export function getEmployeesByRole() {
  const [response, setResponse] = useState<ApiResponse<
    UserCompanyModel[] | ErrorResponse
  > | null>(null);
  const [isGettingUsersCompanyByRole, setIsGettingUsersCompanyByRole] =
    useState(false);

  async function perform(
    company_id: number,
    role: UserCompanyRole,
    token: string
  ) {
    try {
      setIsGettingUsersCompanyByRole(true);
      const response = await api.get<UserCompanyModel[] | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/companies/employees_by_role/${company_id}?role=${role}`,
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
      setIsGettingUsersCompanyByRole(false);
    }
  }

  return {
    perform,
    isGettingUsersCompanyByRole,
    getEmployeesByRoleResponse: response,
  };
}
