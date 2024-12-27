import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { UserCompanyModel } from "../../../entities/users_companies/model";
import { StatusCodes } from "http-status-codes";

export function updateUserCompany() {
  const [response, setResponse] = useState<ApiResponse<
    UserCompanyModel | string
  > | null>(null);
  const [isUpdatingUserCompany, setIsUpdatingUserCompany] = useState(false);

  async function perform(
    userCompany: UserCompanyModel,
    company_id: number,
    token: string
  ) {
    try {
      setIsUpdatingUserCompany(true);
      const response = await api.put<UserCompanyModel | string>(
        `${API_BASE_ROUTE_EXTENSION}/users_companies/${userCompany.id}?company_id=${company_id}`,
        {
          user_company: { roles: userCompany.roles },
        },
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
      console.log("Error updating user company", error);
      return {
        data: {} as UserCompanyModel,
        status: (error as any).status,
      };
    } finally {
      setIsUpdatingUserCompany(false);
    }
  }

  return {
    perform,
    isUpdatingUserCompany,
    updateUserCompanyResponse: response,
  };
}
