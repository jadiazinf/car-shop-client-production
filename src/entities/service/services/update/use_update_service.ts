import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import ServiceModel from "../../model";
import UpdateServiceService from "./update_service";

export type UpdateServiceProps = {
  payload: ServiceModel | { message: string };
  errorMessage: string | null;
  status: StatusCodes;
}

function useUpdateServiceService() {

  const [ payloadState, setPayloadState ] = useState<UpdateServiceProps | "not loaded">("not loaded");

  const [ isUpdatingService, setIsUpdatingService ] = useState<boolean>(false);

  async function performUpdateService(data: {service: ServiceModel, token: string, company_id: number}, callback?: (data: UpdateServiceProps) => void) {
    setIsUpdatingService(true);
    const service = new UpdateServiceService({service: data.service, token: data.token, company_id: data.company_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsUpdatingService(false);
  }

  return {
    isUpdatingService,
    performUpdateService,
    payloadState
  };
}

export default useUpdateServiceService;
