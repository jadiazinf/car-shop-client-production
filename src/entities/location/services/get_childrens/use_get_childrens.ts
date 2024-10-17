import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import LocationModel from "../../model";
import GetLocationChildrensService from "./get_childrens";

export type GetLocationChildrensProps = {
  payload: LocationModel[];
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetLocationChildrens() {

  const [ payloadState, setPayloadState ] = useState<GetLocationChildrensProps | "not loaded">("not loaded");

  const [ isGettingLocationsChildrensLoading, setIsGettingLocationsChildrensLoading ] = useState<boolean>(false);

  async function performGetLocationChildrens(data: {location_id: number}, callback?: (data: GetLocationChildrensProps) => void) {
    setIsGettingLocationsChildrensLoading(true);
    const service = new GetLocationChildrensService({ location_id: data.location_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingLocationsChildrensLoading(false);
  }

  return {
    isGettingLocationsChildrensLoading,
    performGetLocationChildrens,
    payloadState
  };
}

export default useGetLocationChildrens;
