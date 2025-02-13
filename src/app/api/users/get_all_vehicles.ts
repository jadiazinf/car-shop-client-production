import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import axios from "axios";
import VehicleModel from "../../../entities/vehicle/model";

export function getAllUserVehicles() {
  const [response, setResponse] = useState<ApiResponse<VehicleModel[]> | null>(
    null
  );

  const [isGettingVehicles, setIsGettingVehicles] = useState(false);

  async function perform(token: string) {
    try {
      setIsGettingVehicles(true);

      const response = await api.get<VehicleModel[]>(
        `${API_BASE_ROUTE_EXTENSION}/users/all_vehicles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === StatusCodes.OK) {
        setResponse({
          data: response.data,
          status: StatusCodes.OK,
        });

        return {
          data: response.data,
          status: StatusCodes.OK,
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponse({
          data: null,
          status: StatusCodes.BAD_REQUEST,
        });
        return {
          data: null,
          status: StatusCodes.BAD_REQUEST,
        };
      } else {
        setResponse({
          data: null,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
        return { data: null, status: StatusCodes.INTERNAL_SERVER_ERROR };
      }
    } finally {
      setIsGettingVehicles(false);
    }
  }

  return { perform, isGettingVehicles, userVehiclesResponse: response };
}
