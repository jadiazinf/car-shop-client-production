import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import { QuoteModel } from "../../../entities/quote/model";

export default function getQuote() {
  const [response, setResponse] = useState<ApiResponse<QuoteModel> | null>(
    null
  );

  const [isGettingQuote, setIsGettingQuote] = useState(false);

  async function perform(quote_id: number, token: string) {
    try {
      setIsGettingQuote(true);
      const response = await api.get<QuoteModel>(
        `${API_BASE_ROUTE_EXTENSION}/quotes/${quote_id}`,
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
    } catch (error) {
      setResponse({
        data: null,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    } finally {
      setIsGettingQuote(false);
    }
  }

  return { perform, isGettingQuote, getQuoteResponse: response };
}
