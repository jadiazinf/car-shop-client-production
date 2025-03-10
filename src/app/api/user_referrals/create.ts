import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { UserReferralBy } from "../../../entities/user_referrals/types";

export function createUserReferral() {
  const [response, setResponse] = useState<ApiResponse<any> | null>(null);

  const [isCreatingUserReferral, setIsCreatingUserReferral] = useState(false);

  async function perform(user_id: number, referral_by: UserReferralBy) {
    try {
      setIsCreatingUserReferral(true);
      const response = await api.post(
        `${API_BASE_ROUTE_EXTENSION}/user_referrals`,
        {
          user_referral: {
            user_id,
            referral_by,
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
      setIsCreatingUserReferral(false);
    }
  }

  return {
    perform,
    isCreatingUserReferral,
    createUserReferralResponse: response,
  };
}
