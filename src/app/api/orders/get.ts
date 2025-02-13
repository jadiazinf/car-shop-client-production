import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { OrderModel } from "../../../entities/order/model";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";

export function getOrder() {
  const [response, setResponse] = useState<ApiResponse<OrderModel> | null>(
    null
  );

  const [isGettingOrder, setIsGettingOrder] = useState(false);

  async function perform(order_id: number, company_id: number, token: string) {
    try {
      setIsGettingOrder(true);
      const response = await api.get<OrderModel>(
        `${API_BASE_ROUTE_EXTENSION}/orders/${order_id}?company_id=${company_id}`,
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
      setIsGettingOrder(false);
    }
  }

  return {
    perform,
    isGettingOrder,
    getOrderResponse: response,
  };
}
