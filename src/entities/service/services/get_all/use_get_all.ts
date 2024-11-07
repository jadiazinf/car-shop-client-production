import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import ServiceModel from "../../model";
import GetAllServicesService from "./get_all_service";
import { PaginatedData } from "../../../../helpers/application_response/types";

export type GetAllServicesProps = {
  payload: PaginatedData<ServiceModel>;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetAllServicesService() {

  const [ payloadState, setPayloadState ] = useState<GetAllServicesProps | "not loaded">("not loaded");

  const [ isGettingServices, setIsGettingServices ] = useState<boolean>(false);

  async function performGetAllServices(data: {page: number, company_id: number}, callback?: (data: GetAllServicesProps) => void) {
    setIsGettingServices(true);
    const service = new GetAllServicesService({company_id: data.company_id});
    await service.perform({page: data.page});
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingServices(false);
  }

  return {
    isGettingServices,
    performGetAllServices,
    payloadState
  };
}

export default useGetAllServicesService;
