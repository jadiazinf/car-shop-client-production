import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { QuoteModel } from "../../../entities/quote/model";

type Response = { quote?: QuoteModel; errors?: string[] };

export function updateQuote() {
  const [response, setResponse] = useState<ApiResponse<Response> | null>(null);
  const [isUpdatingQuote, setIsUpdatingQuote] = useState(false);

  async function perform(quote: QuoteModel, token: string) {
    try {
      setIsUpdatingQuote(true);
      const response = await api.patch<{
        quote?: QuoteModel;
        errors?: string[];
      }>(
        `${API_BASE_ROUTE_EXTENSION}/quotes/${quote.id}`,
        {
          quote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse({
        data: {
          quote: response.data.quote,
        },
        status: response.status as StatusCodes,
      });
      return {
        data: {
          quote: response.data.quote,
        },
        status: response.status as StatusCodes,
      };
    } catch (error) {
      console.log("Error creating user", error);
      return {
        data: {
          errors: ((error as AxiosError).response!.data as { errors: string[] })
            .errors! as string[],
        },
        status: (error as any).status as StatusCodes,
      };
    } finally {
      setIsUpdatingQuote(false);
    }
  }

  return {
    perform,
    isUpdatingQuote,
    updateQuoteResponse: response,
  };
}
