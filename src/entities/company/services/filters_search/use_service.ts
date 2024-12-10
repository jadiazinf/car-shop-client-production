import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CompanyModel from "../../model";
import { PaginatedData } from "../../../../helpers/application_response/types";
import { ServicesFilters } from "../../components/filters/types";
import CompaniesFilterSearchService from ".";

export type GetCompaniesFilterSearchProps = {
  payload: CompanyModel[] | PaginatedData<CompanyModel> | null;
  errorMessage: string | null;
  status: StatusCodes;
};

function useCompaniesFilterSearchService() {
  const [payloadState, setPayloadState] = useState<
    GetCompaniesFilterSearchProps | "not loaded"
  >("not loaded");

  const [
    isGettingCompaniesWithFiltersLoading,
    setIsGettingCompaniesWithFiltersLoading,
  ] = useState<boolean>(false);

  async function performGetCompanyWithFilters(
    data: { page: number; filters: ServicesFilters },
    callback?: (data: GetCompaniesFilterSearchProps) => void
  ) {
    setIsGettingCompaniesWithFiltersLoading(true);
    const service = new CompaniesFilterSearchService();
    await service.perform({ filters: data.filters, page: data.page });
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response);
    callback && callback(response);
    setIsGettingCompaniesWithFiltersLoading(false);
  }

  return {
    isGettingCompaniesWithFiltersLoading,
    performGetCompanyWithFilters,
    payloadState,
  };
}

export default useCompaniesFilterSearchService;
