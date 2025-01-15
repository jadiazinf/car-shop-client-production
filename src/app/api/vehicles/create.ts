import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import VehicleModel from "../../../entities/vehicle/model";
import { AxiosError } from "axios";

type ErrorResponse = {
  errors: string[];
};

export function createVehicle() {
  const [response, setResponse] = useState<ApiResponse<
    VehicleModel | ErrorResponse
  > | null>(null);
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);

  async function perform(
    vehicle: VehicleModel,
    token: string,
    user_id: number
  ) {
    try {
      setIsCreatingVehicle(true);
      const { vehicle_images, ...newVehicle } = vehicle;
      const response = await api.post<VehicleModel>(
        `${API_BASE_ROUTE_EXTENSION}/vehicles`,
        {
          vehicle: { ...newVehicle, user_id },
        },
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
      setIsCreatingVehicle(false);
    }
  }

  return {
    perform,
    isCreatingVehicle,
    createVehicleResponse: response,
  };
}
