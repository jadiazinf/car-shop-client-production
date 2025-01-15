import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import CompanyModel from "../../../entities/company/model";

type Response = CompanyModel | { errors?: string[] };

export function createCompany() {
  const [response, setResponse] = useState<ApiResponse<Response> | null>(null);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);

  function getFormData(company: CompanyModel, user_id: number) {
    const formData = new FormData();

    company.company_images!.forEach((file) => {
      formData.append(`company_images[]`, file);
    });

    formData.append("company_charter", company.company_charter!);

    formData.append("address", company.address);

    formData.append("dni", company.dni);

    formData.append("name", company.name);

    formData.append("email", company.email);

    formData.append("location_id", company.location_id!.toString());

    formData.append("user_id", user_id.toString());

    return formData;
  }

  async function perform(
    company: CompanyModel,
    user_id: number,
    token: string
  ) {
    try {
      setIsCreatingCompany(true);
      const formData = getFormData(company, user_id);
      const response = await api.postForm<Response>(
        `${API_BASE_ROUTE_EXTENSION}/companies`,
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
      console.log("Error creating company", error);
      return {
        data: {
          errors: ((error as AxiosError).response!.data as { errors: string[] })
            .errors! as string[],
        },
        status: (error as any).status as StatusCodes,
      };
    } finally {
      setIsCreatingCompany(false);
    }
  }

  return {
    perform,
    isCreatingCompany,
    createCompanyResponse: response,
  };
}
