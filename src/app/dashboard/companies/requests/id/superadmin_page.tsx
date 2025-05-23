import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import CompanyInfo from "../../../../../entities/company/components/info";
import UserInfo from "../../../../../entities/user/components/info";
import { UserCompanyRequestStatus } from "../../../../../entities/user_company_request/types";
import { IoMdArrowDropdown } from "react-icons/io";
import UserCompanyRequestHelper from "../../../../../entities/user_company_request/helper";
import TextComponent from "../../../../../components/inputs/text";
import ButtonComponent from "../../../../../components/buttons/component";
import LogoComponent from "../../../../../components/logo/component";
import useUpdateUserCompanyRequest from "../../../../../entities/user_company_request/services/update/use_update";
import { usePersistedStore } from "../../../../../store/store";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import { HeaderBreadcrumbItemProps } from "../../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../../components/breadcrumbs/context";
import { useUsersCompaniesRequestsApiServices } from "../../../../api/users_companies_requests";
import UserCompanyRequestModel from "../../../../../entities/user_company_request/model";

const HEADER_BREADCRUMBS_OPTIONS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Dashboard",
    url: "/dashboard",
  },
  {
    text: "Compañía",
    url: "/dashboard/companies",
  },
  {
    text: "Peticiones",
    url: "/dashboard/companies/requests",
  },
  {
    text: "Petición",
    url: "/dashboard/companies/requests",
  },
];

function CompanyRequestPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const params = useParams();

  const { sessionType, token } = usePersistedStore().authReducer;


  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  const {
    getUserCompanyRequestResponse,
    isGettingUserCompanyRequest,
    perform
  } = useUsersCompaniesRequestsApiServices.getUserCompanyRequest();

  const [selectedOption, setSelectedOption] = useState<
    Set<UserCompanyRequestStatus>
  >(new Set([UserCompanyRequestStatus.APPROVED]));

  const [selectedStatus, setSelectedStatus] =
    useState<UserCompanyRequestStatus>(UserCompanyRequestStatus.APPROVED);

  const {
    isOpen: isRejectionOpen,
    onOpenChange: onOpenRejectionChange,
    onClose: onRejectionClose,
  } = useDisclosure();

  const {
    isOpen: isApprovedOpen,
    onOpenChange: onOpenApprovedChange,
    onClose: onApprovedClose,
  } = useDisclosure();

  const [rejectionMessage, setRejectionMessage] = useState<{ message: string }>(
    { message: "" }
  );

  const [showOption, setShowOption] = useState<"user" | "company">("user");

  const {
    isUpdatingUserCompanyRequestLoading,
    payloadState: updateRequestResponse,
    performUpdateUserCompanyRequest,
  } = useUpdateUserCompanyRequest();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS_OPTIONS);
    perform(parseInt(params.id!), token!);
  }, []);

  useEffect(() => {
    setSelectedStatus(
      Array.from(selectedOption)[0] as UserCompanyRequestStatus
    );
  }, [selectedOption]);

  const handleSelectionChange = (value: unknown) => {
    if (value instanceof Set && value.size > 0) {
      const selectedValue = Array.from(value)[0];

      if (
        typeof selectedValue === "string" &&
        Object.values(UserCompanyRequestStatus).includes(
          selectedValue as UserCompanyRequestStatus
        )
      ) {
        setSelectedOption(new Set([selectedValue as UserCompanyRequestStatus]));
      } else {
        console.error("Invalid selection");
      }
    } else {
      console.error("Invalid selection or empty Set");
    }
  };

  async function handleSubmit() {
    await performUpdateUserCompanyRequest({
      request: {
        responder_user_id: sessionType!.user.id!,
        status: selectedStatus,
        message:
          selectedStatus === UserCompanyRequestStatus.REJECTED
            ? rejectionMessage.message
            : "",
      },
      user_company_request_id: parseInt(params.id!),
      company_id: (getUserCompanyRequestResponse!.data as UserCompanyRequestModel).company!.id!,
    });
  }

  useEffect(() => {
    if (updateRequestResponse !== "not loaded") {
      if (updateRequestResponse.status === StatusCodes.OK) {
        toasterDispatch({
          payload: "Petición respondida satisfactoriamente",
          type: "SUCCESS",
        });
        navigate("/dashboard/companies/requests");
      } else
        toasterDispatch({
          payload: updateRequestResponse.errorMessage!,
          type: "ERROR",
        });
      if (selectedStatus === UserCompanyRequestStatus.APPROVED)
        onApprovedClose();
      else onRejectionClose();
    }
  }, [updateRequestResponse]);

  return (
    <>
      <Modal
        isOpen={isRejectionOpen}
        onOpenChange={onOpenRejectionChange}
        size="2xl"
        radius="sm"
      >
        <ModalContent>
          <ModalBody className="p-10">
            <div className="w-auto flex flex-col gap-5 justify-center items-center">
              <LogoComponent size="4xl" />
              <TextComponent
                key="rejection"
                name="message"
                onChange={(e) =>
                  setRejectionMessage({ message: e.target.value })
                }
                type="text"
                value={rejectionMessage.message}
                label="Mensaje de rechazo"
              />
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Aceptar"
                  type="button"
                  variant="solid"
                  onClick={handleSubmit}
                  isLoading={isUpdatingUserCompanyRequestLoading}
                />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isApprovedOpen}
        onOpenChange={onOpenApprovedChange}
        size="2xl"
        radius="sm"
      >
        <ModalContent>
          <ModalBody className="p-10">
            <div className="w-auto flex flex-col gap-5 justify-center items-center">
              <LogoComponent size="4xl" />
              <strong>¿Está seguro de aprobar esta petición?</strong>
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Aceptar"
                  type="button"
                  variant="solid"
                  onClick={handleSubmit}
                  isLoading={isUpdatingUserCompanyRequestLoading}
                />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="flex flex-col w-full">
        <div className="mt-5 md:mt-0 flex justify-between w-full">
          <Tabs
            variant="underlined"
            aria-label="Options"
            selectedKey={showOption}
            onSelectionChange={(value) =>
              setShowOption(value as "user" | "company")
            }
          >
            <Tab key="user" title="Ver información de usuario" />
            <Tab key="company" title="Ver información de taller" />
          </Tabs>
          {(getUserCompanyRequestResponse && getUserCompanyRequestResponse.data)
            && (getUserCompanyRequestResponse.data as UserCompanyRequestModel).status === UserCompanyRequestStatus.PENDING && (
              <ButtonGroup variant="flat">
                <Button
                  radius="sm"
                  className={
                    selectedStatus === UserCompanyRequestStatus.APPROVED
                      ? "text-white bg-primary"
                      : "text-red-800 border-1.5 border-red-800"
                  }
                  onPress={
                    selectedStatus === UserCompanyRequestStatus.REJECTED
                      ? onOpenRejectionChange
                      : onOpenApprovedChange
                  }
                  isLoading={isUpdatingUserCompanyRequestLoading}
                >
                  {`${UserCompanyRequestHelper.translateStatusOnAction(
                    Array.from(selectedOption)[0]
                  )} solicitud`}
                </Button>
                <Dropdown placement="bottom-end" radius="sm">
                  <DropdownTrigger>
                    <Button
                      radius="sm"
                      isIconOnly
                      className={
                        selectedStatus === UserCompanyRequestStatus.APPROVED
                          ? "text-white bg-primary"
                          : "text-red border-1.5 border-red-800"
                      }
                    >
                      <IoMdArrowDropdown />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Merge options"
                    selectedKeys={selectedOption}
                    selectionMode="single"
                    onSelectionChange={handleSelectionChange}
                    className="max-w-[300px]"
                  >
                    <DropdownItem
                      key="approved"
                      description="Al aprobar, la compañía podrá ofrecer sus servicios en la plataforma"
                    >
                      Aprobar solicitud
                    </DropdownItem>
                    <DropdownItem
                      key="rejected"
                      description="Al rechazar, la compañía no podrá ofrecer sus servicios en la plataforma, pero el usuario podrá volver a crear otra solicitud de registro"
                    >
                      Rechazar solicitud
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            )}
        </div>
        <div className="flex flex-col">
          <div className="w-full h-full flex justify-center items-center my-10">
            {isGettingUserCompanyRequest ? (
              <Spinner />
            ) : !getUserCompanyRequestResponse || !getUserCompanyRequestResponse.data ? <p>Ha ocurrido un error</p> : (
              <div className="w-full">
                {showOption === "user" ? (
                  <UserInfo user={(getUserCompanyRequestResponse!.data as UserCompanyRequestModel).user!} />
                ) : (
                  <CompanyInfo
                    company={(getUserCompanyRequestResponse!.data as UserCompanyRequestModel).company!}
                    showChangeAvatar={false}
                    imagesAreCommingFrom="server"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyRequestPage;
