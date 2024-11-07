import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CategoryModel from "../../model";
import UpdateCategoryService from "./update_category";

export type UpdateCategoryProps = {
  payload: CategoryModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useUpdateCategory() {

  const [ payloadState, setPayloadState ] = useState<UpdateCategoryProps | "not loaded">("not loaded");

  const [ isUpdatingCategoryLoading, setIsUpdatingCategoryLoading ] = useState<boolean>(false);

  async function performUpdateCategory(data: {category: CategoryModel, company_id: number, token: string}, callback?: (data: UpdateCategoryProps) => void) {
    setIsUpdatingCategoryLoading(true);
    const service = new UpdateCategoryService({ category: data.category, company_id: data.company_id, token: data.token});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsUpdatingCategoryLoading(false);
  }

  return {
    isUpdatingCategoryLoading,
    performUpdateCategory,
    payloadState
  };
}

export default useUpdateCategory;
