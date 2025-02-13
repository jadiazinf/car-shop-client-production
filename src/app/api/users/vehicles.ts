import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import axios from "axios";
import { PaginatedData } from "../../../helpers/application_response/types";
import VehicleModel from "../../../entities/vehicle/model";

export function getUserVehicles() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<VehicleModel>
  > | null>(null);

  const [isGettingVehicles, setIsGettingVehicles] = useState(false);

  async function perform(user_id: number, page: number, token: string) {
    try {
      setIsGettingVehicles(true);

      const response = await api.get<PaginatedData<VehicleModel>>(
        `${API_BASE_ROUTE_EXTENSION}/users/${user_id}/vehicles?page=${page}`,
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
