import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import LocationModel from "../../model";
import GetLocationParentsService from "./get_parents";

export type GetLocationParentsProps = {
  payload: LocationModel[];
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetLocationParents() {

  const [ payloadState, setPayloadState ] = useState<GetLocationParentsProps | "not loaded">("not loaded");

  const [ isGettingLocationParentsLoading, setIsGettingLocationParentsLoading ] = useState<boolean>(false);

  async function performGetLocationParents(data: {location_id: number}, callback?: (data: GetLocationParentsProps) => void) {
    setIsGettingLocationParentsLoading(true);
    const service = new GetLocationParentsService({ location_id: data.location_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingLocationParentsLoading(false);
  }

  return {
    isGettingLocationParentsLoading,
    performGetLocationParents,
    payloadState
  };
}

export default useGetLocationParents;
