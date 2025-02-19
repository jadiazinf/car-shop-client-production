import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { CompanyRatingsProps } from "../../../components/rating/company_ratings";

export function getCompanyRatings() {
  const [response, setResponse] =
    useState<ApiResponse<CompanyRatingsProps> | null>(null);

  const [isGettingRatings, setIsGettingRatings] = useState(false);

  async function perform(company_id: number) {
    try {
      setIsGettingRatings(true);
      const response = await api.get<CompanyRatingsProps>(
        `${API_BASE_ROUTE_EXTENSION}/user_order_reviews/company_ratings?company_id=${company_id}`
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
      setIsGettingRatings(false);
    }
  }

  return {
    perform,
    isGettingRatings,
    getCompanyRatingsResponse: response,
  };
}
