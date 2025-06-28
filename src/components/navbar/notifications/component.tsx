import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Badge } from "@heroui/badge";
import { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { useNotificationsApiServices } from "../../../app/api/notifications";
import { usePersistedStore } from "../../../store/store";
import { StatusCodes } from "http-status-codes";
import { NotificationModel } from "../../../entities/notification/model";
import PaginationComponent from "../../datatable/pagination";
import { PaginatedData } from "../../../helpers/application_response/types";
import { useNavigate } from "react-router-dom";
import { NotificationHelpers } from "../../../entities/notification/helpers";
import { NotificationServices } from "../../../entities/notification/services";

export function NotificationComponent() {
  const { token } = usePersistedStore().authReducer;

  const [notifications, setNotifications] = useState<
    NotificationModel[] | null
  >(null);

  const { perform, getUnreadNotificationsResponse } =
    useNotificationsApiServices.getUnreadNotifications();

  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const { perform: readNotification } = NotificationServices.useReadNotification();

  useEffect(() => {
    getNotifications();
  }, []);

  async function getNotifications() {
    const response = await perform(page, token!);

    if (response.status === StatusCodes.OK && "data" in response.data) {
      if (
        "data" in response.data &&
        Array.isArray(
          (response.data as PaginatedData<NotificationModel>).data
        ) &&
        (response.data as PaginatedData<NotificationModel>).data.length > 0
      ) {
        setNotifications(
          (response.data as PaginatedData<NotificationModel>).data
        );
      }
    }
  }

  function handleNotificationClick(notification: NotificationModel) {
    readNotification(notification.id, token!);
    navigate(NotificationHelpers.getNotificationMessage(notification).link)
  }

  return (
    <div className="relative">
      <Dropdown>
        <DropdownTrigger>
          <div className="flex items-center gap-2 cursor-pointer">
            {notifications && notifications.length > 0 && (
              <Badge
                color="primary"
                content={notifications.length}
                showOutline={false}
                className="p-1 min-w-[20px] min-h-[20px]"
              >
                <IoIosNotifications className="w-6 h-6 text-black text-opacity-30 hover:text-opacity-100 hover:text-primary transition-all duration-300 ease-in-out" />
              </Badge>
            )}
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Notifications actions"
          variant="flat"
          className="max-w-[300px] p-2"
        >
          {!notifications || notifications.length === 0 ? (
            <DropdownItem key="profile" className="h-14 gap-2 text-center">
              <p className="italic text-black text-opacity-50 font-light">
                No hay notificaciones
              </p>
            </DropdownItem>
          ) : (
            <>
              {notifications.map((notification) => (
                <DropdownItem
                  key={notification.id}
                  className="h-14 gap-2 p-2 mb-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  onPress={() =>handleNotificationClick(notification)}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-wrap text-black text-opacity-50 text-sm">
                      {
                        NotificationHelpers.getNotificationMessage(notification)
                          .message
                      }
                    </p>
                  </div>
                </DropdownItem>
              ))}
            </>
          )}
          <DropdownItem key={""}>
            <div className="w-full flex justify-center items-center">
              <PaginationComponent
                page={page}
                setPage={setPage}
                pages={
                  (
                    getUnreadNotificationsResponse?.data as PaginatedData<NotificationModel>
                  )?.total_pages || 0
                }
              />
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
