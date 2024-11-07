import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import CategoryModel from "../../model";
import CreateCategoryService from "./create_category";

export type CreateCategoryProps = {
  payload: CategoryModel;
  errorMessage: string | null;
  status: StatusCodes;
}

function useCreateCategory() {

  const [ payloadState, setPayloadState ] = useState<CreateCategoryProps | "not loaded">("not loaded");

  const [ isCreatingCategoryLoading, setIsCreatingCategoryLoading ] = useState<boolean>(false);

  async function performCreateCategory(data: {category: CategoryModel, company_id: number, token: string}, callback?: (data: CreateCategoryProps) => void) {
    setIsCreatingCategoryLoading(true);
    const service = new CreateCategoryService({ category: data.category, company_id: data.company_id, token: data.token});
    await service.perform();
    const response = {
      payload: service.payload,
      errorMessage: service.errorMessage,
      status: service.status,
    };
    setPayloadState(response)
    callback && callback(response);
    setIsCreatingCategoryLoading(false);
  }

  return {
    isCreatingCategoryLoading,
    performCreateCategory,
    payloadState
  };
}

export default useCreateCategory;
