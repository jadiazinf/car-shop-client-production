import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import ServiceModel from "../../model";
import CreateServiceService from "./create_service";

export type CreateServiceProps = {
  payload: ServiceModel | { message: string };
  errorMessage: string | null;
  status: StatusCodes;
}

function useCreateServiceService() {

  const [ payloadState, setPayloadState ] = useState<CreateServiceProps | "not loaded">("not loaded");

  const [ isCreatingService, setIsCreatingService ] = useState<boolean>(false);

  async function performCreateService(data: {service: ServiceModel, token: string, company_id: number}, callback?: (data: CreateServiceProps) => void) {
    setIsCreatingService(true);
    const service = new CreateServiceService({service: data.service, token: data.token, company_id: data.company_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsCreatingService(false);
  }

  return {
    isCreatingService,
    performCreateService,
    payloadState
  };
}

export default useCreateServiceService;
