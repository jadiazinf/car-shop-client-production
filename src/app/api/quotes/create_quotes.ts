import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { QuoteModel } from "../../../entities/quote/model";

type Response = { message: string };

export function createQuotes() {
  const [response, setResponse] = useState<ApiResponse<Response> | null>(null);
  const [isCreatingQuotes, setIsCreatingQuotes] = useState(false);

  async function perform(quotes: QuoteModel[], token: string) {
    try {
      setIsCreatingQuotes(true);
      const response = await api.post<Response>(
        `${API_BASE_ROUTE_EXTENSION}/quotes`,
        {
          quotes,
        },
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
      console.log("Error creating quotes", error);
      return {
        data: {
          message: ((error as AxiosError).response!.data as { message: string })
            .message! as string,
        },
        status: (error as any).status as StatusCodes,
      };
    } finally {
      setIsCreatingQuotes(false);
    }
  }

  return {
    perform,
    isCreatingQuotes,
    createQuotesResponse: response,
  };
}
