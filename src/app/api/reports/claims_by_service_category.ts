import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";

type Response = {
  claims_by_service_category: {
    [key: string]: number | null;
  };
};

export function claimsByServiceCategory() {
  const [response, setResponse] = useState<ApiResponse<Response> | null>(null);

  const [
    isGettingClaimsByServiceCategory,
    setIsGettingClaimsByServiceCategory,
  ] = useState(false);

  async function perform(
    company_id: number,
    start_date: string,
    end_date: string,
    token: string
  ) {
    try {
      setIsGettingClaimsByServiceCategory(true);
      const response = await api.get<Response>(
        `${API_BASE_ROUTE_EXTENSION}/reports/claims_by_service_category?company_id=${company_id}&start_date=${start_date}&end_date=${end_date}`,
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
      setIsGettingClaimsByServiceCategory(false);
    }
  }

  return {
    perform,
    isGettingClaimsByServiceCategory,
    claimsByServiceCategoryResponse: response,
  };
}
