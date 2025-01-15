import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";

type ErrorResponse = {
  errors: string[];
};

export function toggleActiveVehicle() {
  const [response, setResponse] = useState<ApiResponse<
    { is_active: boolean } | ErrorResponse
  > | null>(null);

  const [isToggelingActiveVehicle, setIsToggelingActiveVehicle] =
    useState(false);

  async function perform(vehicle_id: number, token: string) {
    try {
      setIsToggelingActiveVehicle(true);
      const response = await api.patch<{ is_active: boolean }>(
        `${API_BASE_ROUTE_EXTENSION}/vehicles/${vehicle_id}/toggle_active`,
        {},
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
      setIsToggelingActiveVehicle(false);
    }
  }

  return {
    perform,
    isToggelingActiveVehicle,
    toggleActiveVehicleResponse: response,
  };
}
