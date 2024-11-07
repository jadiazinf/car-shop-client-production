import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CategoryModel from "../../model";
import GetAllCategoriesService from "./get_all_categories";
import { PaginatedData } from '../../../../helpers/application_response/types';

export type GetAllCategoriesProps = {
  payload: PaginatedData<CategoryModel> | CategoryModel[];
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetAllCategories() {

  const [ payloadState, setPayloadState ] = useState<GetAllCategoriesProps | "not loaded">("not loaded");

  const [ isGettingAllCategoriesLoading, setIsGettingAllCategoriesLoading ] = useState<boolean>(false);

  async function performGetAllCategories(data?: {page: number}, callback?: (data: GetAllCategoriesProps) => void) {
    setIsGettingAllCategoriesLoading(true);
    const service = new GetAllCategoriesService();
    await service.perform(data ? {page: data.page} : undefined);
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingAllCategoriesLoading(false);
  }

  return {
    isGettingAllCategoriesLoading,
    performGetAllCategories,
    payloadState
  };
}

export default useGetAllCategories;
