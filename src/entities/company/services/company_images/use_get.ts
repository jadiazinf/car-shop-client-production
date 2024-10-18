import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import GetCompanyImagesService from "./get";

export type GetCompanyImagesProps = {
  payload: Blob | null;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetCompanyImages() {

  const [ payloadState, setPayloadState ] = useState<GetCompanyImagesProps | "not loaded">("not loaded");

  const [ isGettingCompanyImagesLoading, setIsGettingCompanyImagesLoading ] = useState<boolean>(false);

  async function performGetCompanyImages(data: {company_id: number}, callback?: (data: GetCompanyImagesProps) => void) {
    setIsGettingCompanyImagesLoading(true);
    const service = new GetCompanyImagesService({company_id: data.company_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingCompanyImagesLoading(false);
  }

  return {
    isGettingCompanyImagesLoading,
    performGetCompanyImages,
    payloadState
  };
}

export default useGetCompanyImages;
