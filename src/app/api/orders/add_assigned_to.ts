import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { ServiceOrderModel } from "../../../entities/service_order/model";

type ErrorResponse = {
  errors: string[];
};

export function addAssignedTo() {
  const [response, setResponse] =
    useState<ApiResponse<ServiceOrderModel> | null>(null);

  const [isAssigningServiceOrder, setIsAssigningServiceOrder] = useState(false);

  async function perform(
    id: number,
    user_company_id: number,
    company_id: number,
    token: string
  ) {
    try {
      setIsAssigningServiceOrder(true);
      const response = await api.patch<ServiceOrderModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/orders/${id}/add_user_company?company_id=${company_id}`,
        {
          order: { user_company_id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse({
        data: response.data as ServiceOrderModel,
        status: response.status as StatusCodes,
      });
      return {
        data: response.data as ServiceOrderModel,
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
      setIsAssigningServiceOrder(false);
    }
  }

  return {
    perform,
    isAssigningServiceOrder,
    addAssignedToResponse: response,
  };
}
