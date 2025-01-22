import { useState } from "react";
import UserModel from "../../../entities/user/model";
import { api } from "..";
import { StatusCodes } from "http-status-codes";

export function registerUser() {
  const [isRegisteringUserLoading, setIsRegisteringUserLoading] =
    useState(false);

  async function perform(newUser: UserModel) {
    try {
      setIsRegisteringUserLoading(true);
      const response = await api.post<{ user?: UserModel; errors: string[] }>(
        "/signup",
        {
          user: newUser,
        }
      );
      setIsRegisteringUserLoading(false);
      if (response.status === StatusCodes.CREATED)
        return {
          data: { user: response.data.user as UserModel },
          status: response.status as StatusCodes,
        };
      else
        return {
          data: { errors: response.data.errors as string[] },
          status: response.status as StatusCodes,
        };
    } catch (error) {
      console.log("Error registering user", error);
      return {
        data: {},
        status: (error as any).status,
      };
    } finally {
      setIsRegisteringUserLoading(false);
    }
  }

  return { perform, isRegisteringUserLoading };
}
