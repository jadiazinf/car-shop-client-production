import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { OrderModel } from "../../../entities/order/model";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";

type ErrorResponse = {
  errors: string[];
};

export function updateOrder() {
  const [response, setResponse] = useState<ApiResponse<OrderModel> | null>(
    null
  );

  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  async function perform(props: OrderModel, company_id: number, token: string) {
    try {
      setIsUpdatingOrder(true);
      const response = await api.patch<OrderModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/orders/${props.id}?company_id=${company_id}`,
        {
          order: { ...props },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse({
        data: response.data as OrderModel,
        status: response.status as StatusCodes,
      });
      return {
        data: response.data as OrderModel,
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
      setIsUpdatingOrder(false);
    }
  }

  return {
    perform,
    isUpdatingOrder,
    updateOrderResponse: response,
  };
}
