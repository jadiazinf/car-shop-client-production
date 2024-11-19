import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import { ErrorsMessage } from "../../../../helpers/application_response/types";
import SetCompanyProfileImageService from "./set_profile_image_service";

export type SetCompanyProfileImageProps = {
  payload: string | ErrorsMessage | null;
  errorMessage: string | null;
  status: StatusCodes;
}

function useSetCompanyProfileImage() {

  const [ payloadState, setPayloadState ] = useState<SetCompanyProfileImageProps | "not loaded">("not loaded");

  const [ isSettingCompanyProfileImageLoading, setIsSettingCompanyProfileImageLoading ] = useState<boolean>(false);

  async function performSetCompanyProfileImage(data: {image: File, company_id: number, token: string}, callback?: (data: SetCompanyProfileImageProps) => void) {
    setIsSettingCompanyProfileImageLoading(true);
    const service = new SetCompanyProfileImageService({image: data.image, company_id: data.company_id, token: data.token});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsSettingCompanyProfileImageLoading(false);
  }

  return {
    isSettingCompanyProfileImageLoading,
    performSetCompanyProfileImage,
    payloadState
  };
}

export default useSetCompanyProfileImage;
