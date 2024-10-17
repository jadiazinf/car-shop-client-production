import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import LocationModel from "../../model";
import GetLocationService from './get';

export type GetLocationProps = {
  payload: LocationModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetLocation() {

  const [ payloadState, setPayloadState ] = useState<GetLocationProps | "not loaded">("not loaded");

  const [ isGettingLocationLoading, setIsGettingLocationLoading ] = useState<boolean>(false);

  async function performGetUserCompanies(data: {location_id: number}, callback?: (data: GetLocationProps) => void) {
    setIsGettingLocationLoading(true);
    const service = new GetLocationService({ location_id: data.location_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingLocationLoading(false);
  }

  return {
    isGettingLocationLoading,
    performGetUserCompanies,
    payloadState
  };
}

export default useGetLocation;
