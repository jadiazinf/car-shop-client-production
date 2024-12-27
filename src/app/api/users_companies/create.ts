import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { UserCompanyModel } from "../../../entities/users_companies/model";
import { StatusCodes } from "http-status-codes";

export function createUserCompany() {
  const [response, setResponse] =
    useState<ApiResponse<UserCompanyModel> | null>(null);
  const [isCreatingUserCompany, setIsCreatingUserCompany] = useState(false);

  async function perform(newUserCompany: UserCompanyModel, token: string) {
    try {
      setIsCreatingUserCompany(true);
      const response = await api.post<UserCompanyModel>(
        `${API_BASE_ROUTE_EXTENSION}/users_companies`,
        {
          user_company: newUserCompany,
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
      console.log("Error creating user company", error);
      return {
        data: {} as UserCompanyModel,
        status: (error as any).status,
      };
    } finally {
      setIsCreatingUserCompany(false);
    }
  }

  return {
    perform,
    isCreatingUserCompany,
    createUserCompanyResponse: response,
  };
}
