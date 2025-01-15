import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION, ApiResponse } from "..";
import { StatusCodes } from "http-status-codes";
import UserModel from "../../../entities/user/model";
import { AxiosError } from "axios";

type Response = UserModel | { errors?: string[]; token?: string };

export function updateGeneralUser() {
  const [response, setResponse] = useState<ApiResponse<Response> | null>(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  async function perform(user_id: number, values: Object, token: string) {
    try {
      setIsUpdatingUser(true);
      const response = await api.patch<UserModel | { errors?: string[] }>(
        `${API_BASE_ROUTE_EXTENSION}/users/${user_id}`,
        {
          user: values,
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
      console.log("Error updating user", error);
      return {
        data: {
          errors: ((error as AxiosError).response!.data as { errors: string[] })
            .errors! as string[],
        },
        status: (error as any).status as StatusCodes,
      };
    } finally {
      setIsUpdatingUser(false);
    }
  }

  return {
    perform,
    isUpdatingUser,
    updateGeneralUserResponse: response,
  };
}
