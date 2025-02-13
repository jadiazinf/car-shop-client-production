import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { ServiceOrderModel } from "../../../entities/service_order/model";

export function getServiceOrder() {
  const [response, setResponse] =
    useState<ApiResponse<ServiceOrderModel> | null>(null);

  const [isGettingServiceOrder, setIsGettingServiceOrder] = useState(false);

  async function perform(
    service_order_id: number,
    company_id: number,
    token: string
  ) {
    try {
      setIsGettingServiceOrder(true);
      const response = await api.get<ServiceOrderModel>(
        `${API_BASE_ROUTE_EXTENSION}/services_orders/${service_order_id}?company_id=${company_id}`,
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
      setIsGettingServiceOrder(false);
    }
  }

  return {
    perform,
    isGettingServiceOrder,
    getServiceOrderResponse: response,
  };
}
