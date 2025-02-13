import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { AdvanceModel } from "../../../entities/advances/model";

type ErrorResponse = {
  errors: string[];
};

export function attachImageToAdavance() {
  const [response, setResponse] = useState<ApiResponse<AdvanceModel> | null>(
    null
  );

  const [isAttachingImages, setIsAttachingImages] = useState(false);

  function getFormData(advance_images: File[]) {
    const formData = new FormData();

    advance_images!.forEach((file) => {
      formData.append(`advance_images[]`, file);
    });

    return formData;
  }

  async function perform(
    advance_id: number,
    advance_images: File[],
    token: string
  ) {
    try {
      setIsAttachingImages(true);
      const formData = getFormData(advance_images);
      const response = await api.postForm<AdvanceModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/advances/${advance_id}/attach_image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse({
        data: response.data as AdvanceModel,
        status: response.status as StatusCodes,
      });
      return {
        data: response.data as AdvanceModel,
        status: response.status as StatusCodes,
      };
    } catch (error) {
      return {
        data: {
          errors: ((error as AxiosError).response!.data as { errors: string[] })
            .errors! as string[],
        },
        status: (error as any).status,
      };
    } finally {
      setIsAttachingImages(false);
    }
  }

  return {
    perform,
    isAttachingImages,
    attachImageToAdavanceResponse: response,
  };
}
