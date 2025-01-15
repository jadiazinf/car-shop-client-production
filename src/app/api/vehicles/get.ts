import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import VehicleModel from "../../../entities/vehicle/model";
import { AxiosError } from "axios";

type ErrorResponse = {
  errors: string[];
};

export function getVehicle() {
  const [response, setResponse] = useState<ApiResponse<
    VehicleModel | ErrorResponse
  > | null>(null);
  const [isGettingVehicle, setIsGettingVehicle] = useState(false);

  async function perform(vehicle_id: number, token: string) {
    try {
      setIsGettingVehicle(true);
      const response = await api.get<VehicleModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/vehicles/${vehicle_id}`,
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
      setIsGettingVehicle(false);
    }
  }

  return {
    perform,
    isGettingVehicle,
    getVehicleResponse: response,
  };
}
