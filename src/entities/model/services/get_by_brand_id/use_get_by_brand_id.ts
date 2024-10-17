import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import BrandModel from "../../model";
import GetModelsByBrandIdService from "./get_by_brand_id";

export type GetModelsByBrandIdProps = {
  payload: BrandModel[];
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetModelsByBrand() {

  const [ payloadState, setPayloadState ] = useState<GetModelsByBrandIdProps | "not loaded">("not loaded");

  const [ isGettingModelsLoading, setIsGettingModelsLoading ] = useState<boolean>(false);

  async function performGetModelsByBrand(data: {brand_id: number}, callback?: (data: GetModelsByBrandIdProps) => void) {
    setIsGettingModelsLoading(true);
    const service = new GetModelsByBrandIdService({ brand_id: data.brand_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingModelsLoading(false);
  }

  return {
    isGettingModelsLoading,
    performGetModelsByBrand,
    payloadState
  };
}

export default useGetModelsByBrand;
