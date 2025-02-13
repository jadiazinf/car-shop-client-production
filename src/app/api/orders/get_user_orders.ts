import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { PaginatedData } from "../../../helpers/application_response/types";
import { OrderModel, OrderStatus } from "../../../entities/order/model";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";

type ErrorResponse = {
  errors: string[];
};

type RequestProps = {
  status?: OrderStatus;
  user_id: number;
  vehicle_id?: number;
  is_checked?: boolean;
  is_active?: boolean;
  page: number;
};

export function getUserOrders() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<OrderModel>
  > | null>(null);

  const [isGettingOrders, setIsGettingOrders] = useState(false);

  async function perform(props: RequestProps, token: string) {
    try {
      setIsGettingOrders(true);
      const response = await api.get<PaginatedData<OrderModel> | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/orders/user_orders?page=${
          props.page
        }&user_id=${props.user_id}${
          props.status ? `&status=${props.status}` : ""
        }${props.is_checked ? `&is_checked=${props.is_checked}` : ""}${
          props.is_active ? `&is_active=${props.is_active}` : ""
        }${props.vehicle_id ? `&vehicle_id=${props.vehicle_id}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse({
        data: response.data as PaginatedData<OrderModel>,
        status: response.status as StatusCodes,
      });
      return {
        data: response.data as PaginatedData<OrderModel>,
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
      setIsGettingOrders(false);
    }
  }

  return {
    perform,
    isGettingOrders,
    getUserOrdersResponse: response,
  };
}
