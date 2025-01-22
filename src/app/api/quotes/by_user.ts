import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import { PaginatedData } from "../../../helpers/application_response/types";
import { QuoteModel } from "../../../entities/quote/model";

export default function getQuotesByUser() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<QuoteModel>
  > | null>(null);

  const [isGettingQuotes, setIsGettingQuotes] = useState(false);

  async function perform(user_id: number, token: string, page: number) {
    try {
      setIsGettingQuotes(true);
      const response = await api.get<PaginatedData<QuoteModel>>(
        `${API_BASE_ROUTE_EXTENSION}/quotes/by_user?user_id=${user_id}&page=${page}`,
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
      setIsGettingQuotes(false);
    }
  }

  return { perform, isGettingQuotes, getQuotesByUserResponse: response };
}
