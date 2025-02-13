import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { ServiceOrderModel } from "../../../entities/service_order/model";

type ErrorResponse = {
  errors: string[];
};

export function createServiceOrder() {
  const [response, setResponse] =
    useState<ApiResponse<ServiceOrderModel> | null>(null);

  const [isCreatingServiceOrder, setIsCreatingServiceOrder] = useState(false);

  async function perform(props: ServiceOrderModel, token: string) {
    try {
      setIsCreatingServiceOrder(true);
      const response = await api.post<ServiceOrderModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/services_orders/`,
        {
          service_order: { ...props },
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
      setIsCreatingServiceOrder(false);
    }
  }

  return {
    perform,
    isCreatingServiceOrder,
    createServiceOrderResponse: response,
  };
}
