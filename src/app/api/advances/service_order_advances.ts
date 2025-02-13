import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { AdvanceModel } from "../../../entities/advances/model";

type ErrorResponse = {
  errors: string[];
};

export function getServiceOrderAdvances() {
  const [response, setResponse] = useState<ApiResponse<
    AdvanceModel[] | ErrorResponse
  > | null>(null);
  const [isGettingAdvances, setIsGettingAdvances] = useState(false);

  async function perform(
    service_order_id: number,
    company_id: number,
    token: string
  ) {
    try {
      setIsGettingAdvances(true);
      const response = await api.get<AdvanceModel[] | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/advances/service_order_advances?service_order_id=${service_order_id}&company_id=${company_id}`,
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
      setIsGettingAdvances(false);
    }
  }

  return {
    perform,
    isGettingAdvances,
    getServiceOrderAdvancesResponse: response,
  };
}
