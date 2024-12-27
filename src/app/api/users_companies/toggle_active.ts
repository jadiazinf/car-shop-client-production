import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { UserCompanyModel } from "../../../entities/users_companies/model";
import { StatusCodes } from "http-status-codes";

export function toggleActive() {
  const [response, setResponse] = useState<ApiResponse<
    UserCompanyModel | string
  > | null>(null);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  async function perform(id: number, company_id: number, token: string) {
    try {
      setIsTogglingActive(true);
      const response = await api.put<UserCompanyModel | string>(
        `${API_BASE_ROUTE_EXTENSION}/users_companies/${id}/toggle_active?company_id=${company_id}`,
        {},
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
      console.log("Error deleting user company", error);
      return {
        data: {} as UserCompanyModel,
        status: (error as any).status,
      };
    } finally {
      setIsTogglingActive(false);
    }
  }

  return {
    perform,
    isTogglingActive,
    toggleActiveResponse: response,
  };
}
