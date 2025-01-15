import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import ApplicationResponse from "../../../helpers/application_response/types";
import LocationModel from "../../../entities/location/model";

export default function getLocationChildrens() {
  const [response, setResponse] = useState<ApiResponse<LocationModel[]> | null>(
    null
  );

  const [isGettingLocationChildrens, setIsGettingLocationChildrens] =
    useState(false);

  async function perform(location_id: number) {
    try {
      setIsGettingLocationChildrens(true);
      const response = await api.get<ApplicationResponse<LocationModel[]>>(
        `${API_BASE_ROUTE_EXTENSION}/locations/${location_id}/location_parents`
      );

      setResponse({
        data: response.data.data,
        status: response.status as StatusCodes,
      });

      return {
        data: response.data.data,
        tatus: response.status as StatusCodes,
      };
    } catch (error) {
      setResponse({
        data: null,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
      return {
        data: null,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    } finally {
      setIsGettingLocationChildrens(false);
    }
  }

  return {
    perform,
    isGettingLocationChildrens,
    locationChildrensResponse: response,
  };
}
