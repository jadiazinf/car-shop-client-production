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
  company_id: number;
  is_checked?: boolean;
  is_active?: boolean;
  license_plate?: string;
  page: number;
};

export function getCompanyQuotes() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<OrderModel>
  > | null>(null);

  const [isGettingQuotes, setIsGettingQuotes] = useState(false);

  async function perform(props: RequestProps, token: string) {
    try {
      setIsGettingQuotes(true);
      const response = await api.get<PaginatedData<OrderModel> | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/orders/company_quotes?page=${props.page}${
          props.status ? `&status=${props.status}` : ""
        }${props.is_checked ? `&is_checked=${props.is_checked}` : ""}${
          props.is_active ? `&is_active=${props.is_active}` : ""
        }${props.company_id ? `&company_id=${props.company_id}` : ""}${
          props.license_plate ? `&license_plate=${props.license_plate}` : ""
        }`,
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
      setIsGettingQuotes(false);
    }
  }

  return {
    perform,
    isGettingQuotes,
    getCompanyQuotesResponse: response,
  };
}
