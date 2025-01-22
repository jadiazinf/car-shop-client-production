import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import ServiceModel from "../../../entities/service/model";

export default function getServices() {
  const [response, setResponse] = useState<ApiResponse<ServiceModel[]> | null>(
    null
  );

  const [isGettingQuoteServices, setIsGettingQuoteServices] = useState(false);

  async function perform(quote_id: number, token: string) {
    try {
      setIsGettingQuoteServices(true);
      const response = await api.get<ServiceModel[]>(
        `${API_BASE_ROUTE_EXTENSION}/quotes/${quote_id}/services`,
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
      setIsGettingQuoteServices(false);
    }
  }

  return { perform, isGettingQuoteServices, getServicesResponse: response };
}
