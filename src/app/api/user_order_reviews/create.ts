import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { UserOrderReviewModel } from "../../../entities/user_order_reviews/model";

export function createReview() {
  const [response, setResponse] =
    useState<ApiResponse<UserOrderReviewModel> | null>(null);

  const [isCreatingReview, setIsCreatingReview] = useState(false);

  async function perform(
    user_order_review: UserOrderReviewModel,
    token: string
  ) {
    try {
      setIsCreatingReview(true);
      const response = await api.post<{
        user_order_review: UserOrderReviewModel;
      }>(
        `${API_BASE_ROUTE_EXTENSION}/user_order_reviews`,
        { user_order_review },
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
      setIsCreatingReview(false);
    }
  }

  return {
    perform,
    isCreatingReview,
    createReviewResponse: response,
  };
}
