import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import axios from "axios";
import CompanyModel from "../../../entities/company/model";
import { PaginatedData } from "../../../helpers/application_response/types";

export function getUserCompanies() {
  const [response, setResponse] = useState<ApiResponse<PaginatedData<CompanyModel>> | null>(
    null
  );

  const [isGettingCompanies, setIsGettingCompanies] = useState(false);

  async function perform(token: string, filters?: {name?: string, rif?: string, status?: boolean | "", page?: number}) {
    try {
      setIsGettingCompanies(true);

      const response = await api.get<PaginatedData<CompanyModel>>(
        `${API_BASE_ROUTE_EXTENSION}/users/user_companies${filters ? `?${new URLSearchParams(Object.entries(filters).reduce((acc, [key, value]) => {
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
      setIsGettingCompanies(false);
    }
  }

  return { perform, isGettingCompanies, userCompaniesResponse: response };
}
