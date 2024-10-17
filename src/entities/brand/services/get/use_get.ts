import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import BrandModel from "../../model";
import GetBrandService from "./get";

export type GetBrandProps = {
  payload: BrandModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetBrand() {

  const [ payloadState, setPayloadState ] = useState<GetBrandProps | "not loaded">("not loaded");

  const [ isGettingBrandLoading, setIsGettingBrandLoading ] = useState<boolean>(false);

  async function performGetUserCompanies(data: {brand_id: number}, callback?: (data: GetBrandProps) => void) {
    setIsGettingBrandLoading(true);
    const service = new GetBrandService({ brand_id: data.brand_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingBrandLoading(false);
  }

  return {
    isGettingBrandLoading,
    performGetUserCompanies,
    payloadState
  };
}

export default useGetBrand;
