import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import axios from "axios";
import { PaginatedData } from "../../../helpers/application_response/types";
import { UserCompanyModel } from "../../../entities/users_companies/model";
import { UserCompanyRole } from '../../../entities/users_companies/types';

export function getCompanyUsers() {
  const [response, setResponse] = useState<ApiResponse<PaginatedData<UserCompanyModel>> | null>(
    null
  );

  const [isGettingCompanyUsers, setIsGettingCompanyUsers] = useState(false);

  async function perform(token: string, filters?: {company_id: number, name?: string, dni?: string, status?: boolean, roles: UserCompanyRole[], page?: number}) {
    try {
      setIsGettingCompanyUsers(true);

      const searchFilters = {...filters, roles: filters?.roles?.join(",") || ""};

      const response = await api.get<PaginatedData<UserCompanyModel>>(
        `${API_BASE_ROUTE_EXTENSION}/users_companies/company_users${filters ? `?${new URLSearchParams(Object.entries(searchFilters).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)).toString()}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === StatusCodes.OK) {
        setResponse({
          data: response.data,
          status: StatusCodes.OK,
        });

        return {
          data: response.data,
          status: StatusCodes.OK,
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponse({
          data: null,
          status: StatusCodes.BAD_REQUEST,
        });
        return {
          data: null,
          status: StatusCodes.BAD_REQUEST,
        };
      } else {
        setResponse({
          data: null,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
        return { data: null, status: StatusCodes.INTERNAL_SERVER_ERROR };
      }
    } finally {
      setIsGettingCompanyUsers(false);
    }
  }

  return { perform, isGettingCompanyUsers, companyUsersResponse: response };
}
