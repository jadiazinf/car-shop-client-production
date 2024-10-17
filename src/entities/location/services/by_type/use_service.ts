import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import LocationModel from "../../model";
import GetLocationsByTypeService from "./service";
import { LocationType } from "../../types";

export type GetLocationByTypeProps = {
  payload: LocationModel[];
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetLocationsByType() {

  const [ payloadState, setPayloadState ] = useState<GetLocationByTypeProps | "not loaded">("not loaded");

  const [ isGettingLocationsLoading, setIsGettingLocationsLoading ] = useState<boolean>(false);

  async function performGetLocationsByType(data: {location_type: LocationType}, callback?: (data: GetLocationByTypeProps) => void) {
    setIsGettingLocationsLoading(true);
    const service = new GetLocationsByTypeService({ location_type: data.location_type});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingLocationsLoading(false);
  }

  return {
    isGettingLocationsLoading,
    performGetLocationsByType,
    payloadState
  };
}

export default useGetLocationsByType;
