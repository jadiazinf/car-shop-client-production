import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { OrderModel } from "../../../entities/order/model";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";

type ErrorResponse = {
  errors: string[];
};

export function createOrder() {
  const [response, setResponse] = useState<ApiResponse<OrderModel> | null>(
    null
  );

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  async function perform(props: OrderModel, token: string) {
    try {
      setIsCreatingOrder(true);
      const response = await api.post<OrderModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/orders/`,
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
      setIsCreatingOrder(false);
    }
  }

  return {
    perform,
    isCreatingOrder,
    createOrderResponse: response,
  };
}
