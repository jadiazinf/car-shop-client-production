import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { UserCompanyModel } from "../../../entities/users_companies/model";
import { StatusCodes } from "http-status-codes";

type IsUserRegisteredOnCompanyResponse = {
  user_company: UserCompanyModel | null;
};

export function isUserRegisteredOnCompany() {
  const [response, setResponse] =
    useState<ApiResponse<IsUserRegisteredOnCompanyResponse> | null>(null);

  const [isValidating, setIsValidating] = useState(false);

  async function perform(
    email: string,
    company_id: number,
    token: string
  ): Promise<ApiResponse<IsUserRegisteredOnCompanyResponse>> {
    try {
      setIsValidating(true);
      const response = await api.get<IsUserRegisteredOnCompanyResponse>(
        `${API_BASE_ROUTE_EXTENSION}/users_companies/validate_user_company?email=${email}&company_id=${company_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse({
        data: response.data,
        status: response.status,
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error("Error validating if user is registered on company", error);
      const err = error as any;
      setResponse({
        data: err.response?.data || null,
        status: err.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      });
      return {
        data: err.response?.data || null,
        status: err.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      };
    } finally {
      setIsValidating(false);
    }
  }

  return { perform, isValidating, isUserRegisteredOnCompanyResponse: response };
}
