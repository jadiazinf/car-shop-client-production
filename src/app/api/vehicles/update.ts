import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import VehicleModel from "../../../entities/vehicle/model";
import { AxiosError } from "axios";

type ErrorResponse = {
  errors: string[];
};

export function updateVehicle() {
  const [response, setResponse] = useState<ApiResponse<
    VehicleModel | ErrorResponse
  > | null>(null);
  const [isUpdatingVehicle, setIsUpdatingVehicle] = useState(false);

  async function perform(vehicle: Partial<VehicleModel>, token: string) {
    try {
      setIsUpdatingVehicle(true);
      const { vehicle_images, ...updatedVehicle } = vehicle;
      const response = await api.patch<VehicleModel>(
        `${API_BASE_ROUTE_EXTENSION}/vehicles/${vehicle.id}`,
        {
          vehicle: updatedVehicle,
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
      setIsUpdatingVehicle(false);
    }
  }

  return {
    perform,
    isUpdatingVehicle,
    updateVehicleResponse: response,
  };
}
