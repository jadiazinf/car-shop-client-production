import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import BrandModel from "../../model";
import GetAllBrandsService from "./get_all";

export type GetAllBrandsProps = {
  payload: BrandModel[];
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetAllBrands() {

  const [ payloadState, setPayloadState ] = useState<GetAllBrandsProps | "not loaded">("not loaded");

  const [ isGettingBrandsLoading, setIsGettingBrandsLoading ] = useState<boolean>(false);

  async function performGetAllBrands(callback?: (data: GetAllBrandsProps) => void) {
    setIsGettingBrandsLoading(true);
    const service = new GetAllBrandsService();
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingBrandsLoading(false);
  }

  return {
    isGettingBrandsLoading,
    performGetAllBrands,
    payloadState
  };
}

export default useGetAllBrands;
