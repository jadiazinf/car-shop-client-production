import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { PaginatedData } from "../../../helpers/application_response/types";
import ServiceModel from "../../../entities/service/model";

export function getCompanyServices() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<ServiceModel>
  > | null>(null);
  const [isGettingCompanyServices, setIsGettingCompanyServices] =
    useState(false);

  async function perform(company_id: number, page: number) {
    try {
      setIsGettingCompanyServices(true);
      const response = await api.get<PaginatedData<ServiceModel>>(
        `${API_BASE_ROUTE_EXTENSION}/companies/${company_id}/services?page=${page}`
      );
      setResponse({
        data: {
          ...response.data,
          data: response.data.data.map((element) => ({
            ...element,
            price_for_motorbike:
              parseFloat(element.price_for_motorbike as string) || null,
            price_for_car: parseFloat(element.price_for_car as string) || null,
            price_for_van: parseFloat(element.price_for_van as string) || null,
            price_for_truck:
              parseFloat(element.price_for_truck as string) || null,
          })),
        },
        status: response.status as StatusCodes,
      });
      return {
        data: {
          ...response.data,
          data: response.data.data.map((element) => ({
            ...element,
            price_for_motorbike:
              parseFloat(element.price_for_motorbike as string) || null,
            price_for_car: parseFloat(element.price_for_car as string) || null,
            price_for_van: parseFloat(element.price_for_van as string) || null,
            price_for_truck:
              parseFloat(element.price_for_truck as string) || null,
          })),
        },
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
      setIsGettingCompanyServices(false);
    }
  }

  return {
    perform,
    isGettingCompanyServices,
    getCompanyServicesResponse: response,
  };
}
