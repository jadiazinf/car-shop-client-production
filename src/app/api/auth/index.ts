import { useState } from "react";
import { api } from "..";
import ApplicationResponse from "../../../helpers/application_response/types";
import UserModel from "../../../entities/user/model";
import { StatusCodes } from "http-status-codes";

function registerUser() {
  const [isRegisteringUserLoading, setIsRegisteringUserLoading] =
    useState(false);

  async function perform(newUser: UserModel) {
    try {
      setIsRegisteringUserLoading(true);
      const response = await api.post<ApplicationResponse<UserModel>>(
        "/signup",
        {
          user: newUser,
        }
      );
      setIsRegisteringUserLoading(false);
      return { data: response.data, status: response.status as StatusCodes };
    } catch (error) {
      console.log("Error registering user", error);
      return {
        data: {} as ApplicationResponse<UserModel>,
        status: (error as any).status,
      };
    } finally {
      setIsRegisteringUserLoading(false);
    }
  }

  return { perform, isRegisteringUserLoading };
}

export const useAuthApiServices = {
  registerUser,
};
