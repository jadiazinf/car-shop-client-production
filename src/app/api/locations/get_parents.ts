import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import LocationModel, { FullLocation } from "../../../entities/location/model";
import ApplicationResponse from "../../../helpers/application_response/types";
import { LocationType } from "../../../entities/location/types";

export default function getLocationParents() {
  const [response, setResponse] = useState<ApiResponse<FullLocation> | null>(
    null
  );

  const [isGettingLocationParents, setIsGettingLocationParents] =
    useState(false);

  async function perform(location_id: number) {
    try {
      setIsGettingLocationParents(true);
      const response = await api.get<ApplicationResponse<LocationModel[]>>(
        `${API_BASE_ROUTE_EXTENSION}/locations/${location_id}/location_parents`
      );

      let country;
      let state;
      let city;
      let town;

      response.data.data.forEach((element) => {
        if (element.location_type === LocationType.COUNTRY)
          country = { ...element };
        if (element.location_type === LocationType.STATE)
          state = { ...element };
        if (element.location_type === LocationType.CITY) state = { ...element };
        if (element.location_type === LocationType.TOWN) town = { ...element };
      });

      setResponse({
        data: {
          country: country || ({} as LocationModel),
          state: state || ({} as LocationModel),
          city: city || ({} as LocationModel),
          town: town || ({} as LocationModel),
        },
        status: response.status as StatusCodes,
      });

      return {
        data: {
          country: country || ({} as LocationModel),
          state: state || ({} as LocationModel),
          city: city || ({} as LocationModel),
          town: town || ({} as LocationModel),
        },
        status: response.status as StatusCodes,
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
      setIsGettingLocationParents(false);
    }
  }

  return {
    perform,
    isGettingLocationParents,
    locationParentsResponse: response,
  };
}
