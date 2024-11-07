import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import ServiceModel from "../../model";
import GetServiceService from "./get_service";

export type GetServiceProps = {
  payload: ServiceModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetServiceService() {

  const [ payloadState, setPayloadState ] = useState<GetServiceProps | "not loaded">("not loaded");

  const [ isGettingService, setIsGettingService ] = useState<boolean>(false);

  async function performGetService(data: {service_id: number}, callback?: (data: GetServiceProps) => void) {
    setIsGettingService(true);
    const service = new GetServiceService({service_id: data.service_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingService(false);
  }

  return {
    isGettingService,
    performGetService,
    payloadState
  };
}

export default useGetServiceService;
