import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { UserCompanyModel } from "../../../entities/users_companies/model";
import { StatusCodes } from "http-status-codes";

type Response = {
  user_company: UserCompanyModel | null;
};

export function getUserCompanyByUserAndCompany() {
  const [response, setResponse] = useState<ApiResponse<Response> | null>(null);

  const [isGettingUserCompany, setIsGettingUserCompany] = useState(false);

  async function perform(
    user_id: number,
    company_id: number,
    token: string
  ): Promise<ApiResponse<Response>> {
    try {
      setIsGettingUserCompany(true);
      const response = await api.get<UserCompanyModel>(
        `${API_BASE_ROUTE_EXTENSION}/users_companies/user_company_by_user_and_company?user_id=${user_id}&company_id=${company_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse({
        data: { user_company: response.data },
        status: response.status,
      });
      return {
        data: { user_company: response.data },
        status: response.status,
      };
    } catch (error) {
      console.error(
        "Error getting user company on get_user_company_by_user_and_company",
        error
      );
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
      setIsGettingUserCompany(false);
    }
  }

  return {
    perform,
    isGettingUserCompany,
    getUserCompanyByUserAndCompanyResponse: response,
  };
}
