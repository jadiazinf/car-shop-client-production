import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../index";
import axios from "axios";

type Response = { message?: string; error?: string };

type Payload = { token?: string; errorMessage?: string };

export default function getNewToken() {
  const [response, setResponse] = useState<ApiResponse<Payload> | null>(null);

  const [isGettingNewToken, setIsGettingNewToken] = useState(false);

  async function perform(user_id: number) {
    try {
      setIsGettingNewToken(true);

      const response = await api.get<Response>(
        `${API_BASE_ROUTE_EXTENSION}/users/${user_id}/new_token`
      );

      if (response.status === StatusCodes.BAD_REQUEST) {
        setResponse({
          data: { errorMessage: response.data.error },
          status: StatusCodes.BAD_REQUEST,
        });

        return {
          data: { errorMessage: response.data.error },
          status: StatusCodes.BAD_REQUEST,
        };
      }

      const authorizationHeader = response.headers["authorization"];

      if (!authorizationHeader) {
        setResponse({
          data: {
            errorMessage:
              "No se ha recibido autorización, por favor inicie sesión nuevamente",
          },
          status: StatusCodes.CONFLICT,
        });

        return {
          data: {
            errorMessage:
              "No se ha recibido autorización, por favor inicie sesión nuevamente",
          },
          status: StatusCodes.CONFLICT,
        };
      }

      const token = authorizationHeader.split(" ")[1];
      setResponse({ data: { token }, status: response.status as StatusCodes });
      return { data: { token }, status: response.status as StatusCodes };
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === StatusCodes.BAD_REQUEST
      ) {
        setResponse({
          data: { errorMessage: error.response.data.error },
          status: StatusCodes.BAD_REQUEST,
        });
        return {
          data: { errorMessage: error.response.data.error },
          status: StatusCodes.BAD_REQUEST,
        };
      } else {
        setResponse({
          data: null,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
        return { data: null, status: StatusCodes.INTERNAL_SERVER_ERROR };
      }
    } finally {
      setIsGettingNewToken(false);
    }
  }

  return { perform, isGettingNewToken, usersFilteredResponse: response };
}
