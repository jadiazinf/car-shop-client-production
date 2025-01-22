import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import CompanyModel from "../../../entities/company/model";

type ErrorResponse = {
  errors: string[];
};

export function getCompany() {
  const [response, setResponse] = useState<ApiResponse<
    CompanyModel | ErrorResponse
  > | null>(null);
  const [isGettingCompany, setIsGettingCompany] = useState(false);

  async function perform(company_id: number) {
    try {
      setIsGettingCompany(true);
      const response = await api.get<CompanyModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/companies/${company_id}`
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
      setIsGettingCompany(false);
    }
  }

  return {
    perform,
    isGettingCompany,
    getCompanyResponse: response,
  };
}
