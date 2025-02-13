import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import ServiceModel from "../../../entities/service/model";

export function getService() {
  const [response, setResponse] = useState<ApiResponse<ServiceModel> | null>(
    null
  );

  const [isGettingService, setIsGettingService] = useState(false);

  async function perform(service_id: number) {
    try {
      setIsGettingService(true);
      const response = await api.get<ServiceModel>(
        `${API_BASE_ROUTE_EXTENSION}/services/${service_id}`
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
      setIsGettingService(false);
    }
  }

  return {
    perform,
    isGettingService,
    getServiceResponse: response,
  };
}
