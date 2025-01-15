import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import VehicleModel from "../../../entities/vehicle/model";

export function attachImages() {
  const [response, setResponse] = useState<ApiResponse<VehicleModel> | null>(
    null
  );
  const [isAttachingImages, setIsAttachingImages] = useState(false);

  function transformToFormData(vehicle_images: File[]) {
    const formData = new FormData();
    vehicle_images.forEach((file) => {
      formData.append(`vehicle_images[]`, file);
    });
    return formData;
  }

  async function perform(id: number, vehicle_images: File[], token: string) {
    try {
      setIsAttachingImages(true);
      const formData = transformToFormData(vehicle_images);
      const response = await api.patchForm<VehicleModel>(
        `${API_BASE_ROUTE_EXTENSION}/vehicles/${id}/attach_images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse({
        data: response.data,
        status: response.status as StatusCodes,
      });
      return {
        data: response.data,
        status: response.status as StatusCodes,
      };
    } catch (error) {
      console.log("Error creating user company", error);
      return {
        data: {} as VehicleModel,
        status: (error as any).status,
      };
    } finally {
      setIsAttachingImages(false);
    }
  }

  return {
    perform,
    isAttachingImages,
    attachImagesResponse: response,
  };
}
