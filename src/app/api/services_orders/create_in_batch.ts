import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { ServiceOrderModel } from "../../../entities/service_order/model";

type ErrorResponse = {
  errors: string[];
};

export function createServicesOrdersInBatch() {
  const [response, setResponse] =
    useState<ApiResponse<ServiceOrderModel> | null>(null);

  const [isCreatingServicesOrdersInBatch, setIsCreatingServicesOrdersInBatch] =
    useState(false);

  async function perform(
    props: ServiceOrderModel[],
    order_id: number,
    token: string
  ) {
    try {
      setIsCreatingServicesOrdersInBatch(true);
      const response = await api.post<ServiceOrderModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/services_orders/create_in_batch`,
        {
          services_orders: props,
          order_id,
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
      setIsCreatingServicesOrdersInBatch(false);
    }
  }

  return {
    perform,
    isCreatingServicesOrdersInBatch,
    createServicesOrdersInBatchResponse: response,
  };
}
