import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { AdvanceModel } from "../../../entities/advances/model";

type ErrorResponse = {
  errors: string[];
};

export function createAdvance() {
  const [response, setResponse] = useState<ApiResponse<AdvanceModel> | null>(
    null
  );

  const [isCreatingAdvance, setIsCreatingAdvance] = useState(false);

  async function perform(props: AdvanceModel, token: string) {
    try {
      setIsCreatingAdvance(true);
      const response = await api.post<AdvanceModel | ErrorResponse>(
        `${API_BASE_ROUTE_EXTENSION}/advances/`,
        {
          advance: { ...props },
        },
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
      setIsCreatingAdvance(false);
    }
  }

  return {
    perform,
    isCreatingAdvance,
    createAdvanceResponse: response,
  };
}
