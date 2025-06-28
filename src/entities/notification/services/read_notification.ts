import { useState } from "react";
import { StatusCodes } from "http-status-codes";
import { api, API_BASE_ROUTE_EXTENSION } from "../../../app/api";
import { AxiosError } from "axios";

export type ReadNotificationServerResponseProps = {
  message: string;
}

export type ReadNotificationResponseProps = {
  status: StatusCodes;
  data: ReadNotificationServerResponseProps ;
}

function useReadNotification() {

  const [ response, setResponse ] = useState<ReadNotificationResponseProps | null>(null);

  const [ isReadingNotification, setIsReadingNotification ] = useState<boolean>(false);

  async function perform(id: number, token: string) {
    try {
      setIsReadingNotification(true);
      const response = await api.post<ReadNotificationServerResponseProps>(
        `${API_BASE_ROUTE_EXTENSION}/notifications/${id}/read_notification`,
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
      setIsReadingNotification(false);
    }
  }

  return {
    isReadingNotification,
    perform,
    response
  };
}

export default useReadNotification;
