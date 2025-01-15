import { useState } from "react";
import { api, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import UserModel from "../../../entities/user/model";
import { AxiosError } from "axios";

type Response = { user?: UserModel; errors?: string[]; token?: string };

export function createGeneralUser() {
  const [response, setResponse] = useState<ApiResponse<Response> | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  async function perform(user: UserModel) {
    try {
      setIsCreatingUser(true);
      const response = await api.post<{ user?: UserModel; errors?: string[] }>(
        `signup`,
        {
          user,
        }
      );
      setResponse({
        data: {
          token: response.headers.authorization.split(" ")[1],
          user: response.data.user!,
        },
        status: response.status as StatusCodes,
      });
      return {
        data: {
          token: response.headers.authorization.split(" ")[1],
          user: response.data.user!,
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
      setIsCreatingUser(false);
    }
  }

  return {
    perform,
    isCreatingUser,
    createGeneralUserResponse: response,
  };
}
