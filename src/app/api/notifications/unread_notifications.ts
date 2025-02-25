import { useState } from "react";
import { API_BASE_ROUTE_EXTENSION, ApiResponse, api } from "..";
import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { NotificationModel } from "../../../entities/notification/model";
import { PaginatedData } from "../../../helpers/application_response/types";

export function getUnreadNotifications() {
  const [response, setResponse] = useState<ApiResponse<
    PaginatedData<NotificationModel>
  > | null>(null);

  const [isGettingUnreadNotifications, setIsGettingUnreadNotifications] =
    useState(false);

  async function perform(page: number, token: string) {
    try {
      setIsGettingUnreadNotifications(true);
      const response = await api.get<PaginatedData<NotificationModel>>(
        `${API_BASE_ROUTE_EXTENSION}/notifications/unread_notifications?page=${page}`,
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
      return {
        data: {
          errors: ((error as AxiosError).response!.data as { errors: string[] })
            .errors! as string[],
        },
        status: (error as any).status,
      };
    } finally {
      setIsGettingUnreadNotifications(false);
    }
  }

  return {
    perform,
    isGettingUnreadNotifications,
    getUnreadNotificationsResponse: response,
  };
}
