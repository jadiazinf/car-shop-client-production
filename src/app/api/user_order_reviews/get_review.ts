import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { UserOrderReviewModel } from "../../../entities/user_order_reviews/model";

export function getReview() {
  const [response, setResponse] =
    useState<ApiResponse<UserOrderReviewModel> | null>(null);

  const [isGettingReview, setIsGettingReview] = useState(false);

  async function perform(order_id: number, token: string, company_id?: number) {
    try {
      setIsGettingReview(true);
      const response = await api.get<{
        user_order_review: UserOrderReviewModel;
      }>(
        `${API_BASE_ROUTE_EXTENSION}/user_order_reviews/by_order?order_id=${order_id}${
          company_id ? `&company_id=${company_id}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse({
        data: response.data.user_order_review,
        status: response.status as StatusCodes,
      });
      return {
        data: response.data.user_order_review,
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
      setIsGettingReview(false);
    }
  }

  return {
    perform,
    isGettingReview,
    getReviewResponse: response,
  };
}
