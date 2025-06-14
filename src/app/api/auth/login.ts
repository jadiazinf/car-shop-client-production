import { useState } from "react";
import { api, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import UserModel from "../../../entities/user/model";
import { AxiosError } from "axios";
import ApplicationResponse from "../../../helpers/application_response/types";

type Response = { user: UserModel; token: string } | { error?: string };

export function login() {
  const [response, setResponse] = useState<ApiResponse<Response> | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function perform(email: string, password: string) {
    try {
      setIsSigningIn(true);
      const response = await api.post<
        ApplicationResponse<{ user?: UserModel }>
      >(`login`, {
        user: { email, password },
      });

      console.log("response aaaaa", response.data);
      console.log("response aaaaa 2", response.data.data);
      console.log("response aaaaa 3", response.data.data.user);

      setResponse({
        data: {
          user: response.data.data.user!,
          token: response.headers.authorization.split(" ")[1],
        },
        status: response.status,
      });
      return {
        data: {
          user: response.data.data.user!,
          token: response.headers.authorization.split(" ")[1],
        },
        status: response.status as StatusCodes,
      };
    } catch (error) {
      if ((error as AxiosError).response) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data as { error: string };

        return {
          data: {
            errors:
              responseData?.error ||
              "Error al intentar el acceso, intentelo de nuevo más tarde",
          },
          status:
            axiosError.response?.status || StatusCodes.INTERNAL_SERVER_ERROR,
        };
      }

      return {
        data: {
          errors: "An unknown error occurred",
        },
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    } finally {
      setIsSigningIn(false);
    }
  }

  return {
    perform,
    isSigningIn,
    signInResponse: response,
  };
}
