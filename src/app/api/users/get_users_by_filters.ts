import { useState } from "react";
import { api, API_BASE_ROUTE_EXTENSION } from "..";
import UserModel from "../../../entities/user/model";
import { StatusCodes } from "http-status-codes";
import { UsersFilters } from "./types";
import { ApiResponse } from "../index";

export default function getUsersByFilters() {
  const [response, setResponse] = useState<ApiResponse<UserModel[]> | null>(
    null
  );

  const [isFilteringUsers, setIsFilteringUserLoading] = useState(false);

  async function perform(filters: UsersFilters, token: string) {
    try {
      setIsFilteringUserLoading(true);
      const response = await api.get<UserModel[]>(
        `${API_BASE_ROUTE_EXTENSION}/users/search_by_filters?${
          filters.name ? `name=${filters.name}` : ""
        }${
          filters.email
            ? `${filters.name ? "&" : ""}email=${filters.email}`
            : ""
        }`,
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
      setIsFilteringUserLoading(false);
    }
  }

  return { perform, isFilteringUsers, usersFilteredResponse: response };
}
