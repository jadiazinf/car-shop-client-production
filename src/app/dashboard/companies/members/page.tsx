import { useContext, useEffect, useState } from "react";
import useGetUsersFromCompanyService from "../../../../entities/users_companies/services/get_users_from_company/use_service";
import { usePersistedStore } from "../../../../store/store";
import DatatableComponent from "../../../../components/datatable/component";
import useDatatableAction from "../../../../components/datatable/use_action";
import ButtonComponent from "../../../../components/buttons/component";
import { IoAdd } from "react-icons/io5";
import PaginationComponent from "../../../../components/datatable/pagination";
import TextComponent from "../../../../components/inputs/text";
import { LiaSearchSolid } from "react-icons/lia";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import CompanyMemberEditUserRole from "./components/edit_user_role";
import { UserCompanyModel } from "../../../../entities/users_companies/model";
import CompanyMemberDeleteUser from "./components/delete_user";
import { useNavigate } from "react-router-dom";
import { UserCompanyHelpers } from "../../../../entities/users_companies/helpers";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { UserCompanyRole } from "../../../../entities/users_companies/types";

const TABLE_COLUMNS_INSTANCE = [
  { key: "first_name", label: "Primer nombre" },
  { key: "last_name", label: "Apellido" },
  { key: "dni", label: "Cédula" },
  { key: "phone_number", label: "Teléfono" },
  { key: "roles", label: "Roles" },
  { key: "actions", label: "Acciones" },
];

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
    text: "Miembros",
    url: "/dashboard/companies/members",
  },
];

export default function CompanyMembersPage() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [searchMemberName, setSearcgMemberName] = useState("");

  const [page, setPage] = useState(1);

  const {
    isGettingUsersFromCompanyLoading,
    payloadState,
    performGetUsersFromCompany,
  } = useGetUsersFromCompanyService();

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const navigate = useNavigate();

  const {
    isOpen: isUpdateUserModalOpen,
    onOpen: onUpdateUserModalOpen,
    onOpenChange: onUpdateUserModalOpenChange,
    onClose: onUpdateUserModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteUserModalOpen,
    onOpen: onDeleteUserModalOpen,
    onOpenChange: onDeleteUserModalOpenChange,
    onClose: onDeleteUserModalClose,
  } = useDisclosure();

  const TABLE_COLUMNS = sessionType?.roles?.includes(UserCompanyRole.SUPERVISOR)
    ? TABLE_COLUMNS_INSTANCE.filter((element) => element.key !== "actions")
    : TABLE_COLUMNS_INSTANCE;

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS_OPTIONS);
  }, []);

  useEffect(() => {
    performGetUsersFromCompany({
      company_id: sessionType!.company_id!,
      page_number: page,
      token: token!,
      name: searchMemberName,
    });
  }, [page, searchMemberName]);

  useEffect(() => {
    if (datatableAction.action === "update") onUpdateUserModalOpen();
    if (datatableAction.action === "delete") onDeleteUserModalOpen();
  }, [datatableAction.action]);

  useEffect(() => {
    if (!isUpdateUserModalOpen && datatableAction.action === "update")
      setDatatableAction({ action: "", id: null });
    if (!isDeleteUserModalOpen && datatableAction.action === "delete")
      setDatatableAction({ action: "", id: null });
  }, [isUpdateUserModalOpen, isDeleteUserModalOpen]);

  function getParsedData() {
    if (payloadState === "not loaded") return [];

    return payloadState.payload.data.map((element, index) => ({
      ...element,
      first_name: element.user!.first_name,
      last_name: element.user!.last_name,
      dni: element.user!.dni,
      phone_number: element.user!.phone_number,
      roles: payloadState.payload.data[index].roles
        .map((element) => UserCompanyHelpers.translateUserCompanyRole(element))
        .join(", "),
    }));
  }

  function handleSearchMemberNameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSearcgMemberName(event.target.value);
  }

  function getSelectedUser() {
    if (payloadState === "not loaded") return null;

    return payloadState.payload.data.find(
      (element) => element.id === datatableAction.id
    );
  }

  function getLoggedUserCompanyId() {
    if (payloadState === "not loaded") return null;

    const userCompany = payloadState.payload.data.find(
      (element) => element.user_id === sessionType!.user.id!
    );

    return userCompany!.id;
  }

  function refreshData() {
    setPage(1);
    performGetUsersFromCompany({
      company_id: sessionType!.company_id!,
      page_number: 1,
      token: token!,
      name: searchMemberName,
    });
  }

  return (
    <>
      {!datatableAction.id ? null : (
        <Modal
          isOpen={isUpdateUserModalOpen}
          onOpenChange={onUpdateUserModalOpenChange}
          size="2xl"
          className="p-10"
          radius="sm"
        >
          <ModalBody>
            <ModalContent>
              <div className="flex flex-col gap-3">
                <p className="text-3xl font-bold font-inter">
                  Editar rol del miembro
                </p>
                <CompanyMemberEditUserRole
                  closeModal={onUpdateUserModalClose}
                  user_company={getSelectedUser() as UserCompanyModel}
                  onRefresh={refreshData}
                />
              </div>
            </ModalContent>
          </ModalBody>
        </Modal>
      )}
      {!datatableAction.id ? null : (
        <Modal
          isOpen={isDeleteUserModalOpen}
          onOpenChange={onDeleteUserModalOpenChange}
          size="2xl"
          className="p-10"
          radius="sm"
        >
          <ModalBody>
            <ModalContent>
              <div className="flex flex-col gap-3">
                <p className="text-3xl font-bold font-inter">
                  Eliminar miembro
                </p>
                <CompanyMemberDeleteUser
                  closeModal={onDeleteUserModalClose}
                  user_company={getSelectedUser() as UserCompanyModel}
                  onRefresh={refreshData}
                />
              </div>
            </ModalContent>
          </ModalBody>
        </Modal>
      )}
      <div className="w-full h-full flex flex-col gap-2">
        <div className="w-full flex justify-between">
          <div>
            <TextComponent
              name="search"
              type="text"
              value={searchMemberName}
              placeholder="Buscar miembro por nombre"
              variant="bordered"
              onChange={handleSearchMemberNameChange}
              startContent={
                <LiaSearchSolid className="size-5 text-black text-opacity-50" />
              }
            />
          </div>
          {sessionType?.roles?.includes(UserCompanyRole.ADMIN) && (
            <div>
              <ButtonComponent
                color="primary"
                text="Agregar miembro"
                type="button"
                variant="solid"
                startContent={<IoAdd className="w-5 h-5" />}
                onClick={() => navigate("/dashboard/companies/members/new")}
              />
            </div>
          )}
        </div>
        <DatatableComponent
          columns={TABLE_COLUMNS}
          data={getParsedData()}
          isLoading={isGettingUsersFromCompanyLoading}
          actionState={datatableAction}
          setActionState={setDatatableAction}
          isRowDataEditable
          isRowDataDeletable
          disabledRows={
            getLoggedUserCompanyId() ? [getLoggedUserCompanyId() as number] : []
          }
        />
        <div className="w-full flex justify-between">
          <div>
            <p className="text-black text-opacity-50 text-sm">
              {payloadState === "not loaded"
                ? ""
                : `${payloadState.payload.total_count} ${
                    payloadState.payload.total_count === 1
                      ? "miembro"
                      : "miembros"
                  }`}
            </p>
          </div>
          <PaginationComponent
            page={page}
            pages={
              payloadState === "not loaded"
                ? 0
                : payloadState.payload.total_pages
            }
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}
