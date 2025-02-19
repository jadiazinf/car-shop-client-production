import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { UserOrderReviewModel } from "../../../entities/user_order_reviews/model";
import { PaginatedData } from "../../../helpers/application_response/types";

export function getCompanyClaims() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<UserOrderReviewModel>
  > | null>(null);

  const [isGettingCompanyClaims, setIsGettingCompanyClaims] = useState(false);

  async function perform(company_id: number, token: string) {
    try {
      setIsGettingCompanyClaims(true);
      const response = await api.get<PaginatedData<UserOrderReviewModel>>(
        `${API_BASE_ROUTE_EXTENSION}/user_order_reviews/company_claims?company_id=${company_id}`,
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
      setIsGettingCompanyClaims(false);
    }
  }

  return {
    perform,
    isGettingCompanyClaims,
    getCompanyClaimsResponse: response,
  };
}
