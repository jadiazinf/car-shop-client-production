import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CategoryModel from "../../model";
import GetCategoryService from "./get_category";

export type GetCategoryProps = {
  payload: CategoryModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useGetCategory() {

  const [ payloadState, setPayloadState ] = useState<GetCategoryProps | "not loaded">("not loaded");

  const [ isGettingCategoryLoading, setIsGettingCategoryLoading ] = useState<boolean>(false);

  async function performGetCategory(data: {category_id: number}, callback?: (data: GetCategoryProps) => void) {
    setIsGettingCategoryLoading(true);
    const service = new GetCategoryService({ category_id: data.category_id});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsGettingCategoryLoading(false);
  }

  return {
    isGettingCategoryLoading,
    performGetCategory,
    payloadState
  };
}

export default useGetCategory;
