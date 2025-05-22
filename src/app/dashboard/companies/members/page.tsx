import { useContext, useEffect, useState } from "react";
import { usePersistedStore } from "../../../../store/store";
import DatatableComponent from "../../../../components/datatable/component";
import useDatatableAction from "../../../../components/datatable/use_action";
import { IoAdd } from "react-icons/io5";
import PaginationComponent from "../../../../components/datatable/pagination";
import { LiaSearchSolid } from "react-icons/lia";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
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
import { useUsersCompaniesApiServices } from "../../../api/users_companies";
import { FaIdCard } from "react-icons/fa";
import { GoShieldCheck } from "react-icons/go";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

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

  const [page, setPage] = useState(1);

  const {
    companyUsersResponse,
    isGettingCompanyUsers,
    perform
  } = useUsersCompaniesApiServices.getCompanyUsers();

  const [filters, setFilters] = useState<{name: string, dni: string, status: boolean, roles: UserCompanyRole[], page: number}>({
    name: "",
    dni: "",
    status: true,
    roles: [],
    page: 1,
  });

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
    perform(token!, {
      ...filters,
      company_id: sessionType!.company_id!,
    });
  }, [page, filters]);

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
    if (!companyUsersResponse || !companyUsersResponse.data) return [];

    return companyUsersResponse.data.data.map((element) => ({
      ...element,
      first_name: element.user!.first_name,
      last_name: element.user!.last_name,
      dni: element.user!.dni,
      phone_number: element.user!.phone_number,
      roles: element.roles
        .map((element) => UserCompanyHelpers.translateUserCompanyRole(element))
        .join(", "),
    }));
  }

  function getSelectedUser() {
    if (!companyUsersResponse || !companyUsersResponse.data) return null;

    return companyUsersResponse.data?.data.find(
      (element) => element.id === datatableAction.id
    );
  }

  function getLoggedUserCompanyId() {
    if (!companyUsersResponse || !companyUsersResponse.data) return null;

    const userCompany = companyUsersResponse.data.data.find(
      (element) => element.user_id === sessionType!.user.id!
    );

    return userCompany?.id;
  }

  function refreshData() {
    setFilters(prev => ({...prev, page: 1}));
    perform(token!, {
      ...filters,
      company_id: sessionType!.company_id!,
      page: 1
    });
  }

  function handleSelectRoles(e: React.ChangeEvent<HTMLSelectElement>) {
    const values = e.target.value.split(",");
    setFilters((prev) => ({...prev, roles: values as UserCompanyRole[] }));
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
      <div className="w-full h-full flex flex-col gap-5">
        <p className="font-inter text-2xl font-bold">Miembros de la compañía</p>
        <div className="w-full flex flex-col lg:flex-row justify-between gap-5 items-center">
          <Input
            name="name"
            type="text"
            radius="sm"
            size="lg"
            value={filters.name}
            placeholder="Nombre"
            variant="bordered"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            startContent={
              <LiaSearchSolid className="size-5 text-black text-opacity-50" />
            }
          />
          <Input
            name="dni"
            type="text"
            radius="sm"
            size="lg"
            value={filters.dni}
            placeholder="Cédula"
            variant="bordered"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dni: e.target.value,
              }))
            }
            startContent={
              <FaIdCard className="size-5 text-black text-opacity-50" />
            }
          />
          <Select
            name="roles"
            radius="sm"
            size="lg"
            variant="bordered"
            placeholder="Roles"
            onChange={(e) => handleSelectRoles(e)}
            selectionMode="multiple"
            value={filters.roles}
            startContent={<MdOutlineAdminPanelSettings className="size-5 text-black text-opacity-50" />}
          >
            <SelectItem key="admin">Administrador</SelectItem>
            <SelectItem key="supervisor">Supervisor</SelectItem>
            <SelectItem key="technical">Técnico</SelectItem>
          </Select>
          <Select
            name="status"
            radius="sm"
            size="lg"
            variant="bordered"
            placeholder="Estatus"
            onChange={(e) => setFilters({ ...filters, status: e.target.value === "active" })}
            startContent={<GoShieldCheck className="size-5 text-black text-opacity-50" />}
            value={filters.status ? "Activo" : "Inactivo"}
          >
            <SelectItem key="active">Activo</SelectItem>
            <SelectItem key="inactive">Inactivo</SelectItem>
          </Select>
          {sessionType?.roles?.includes(UserCompanyRole.ADMIN) && (
            <Button
              className="w-full"
              color="primary"
              type="button"
              radius="sm"
              size="lg"
              variant="solid"
              startContent={<IoAdd className="w-5 h-5" />}
              onPress={() => navigate("/dashboard/companies/members/new")}
            >
              Agregar miembro
            </Button>
          )}
        </div>
        <DatatableComponent
          columns={TABLE_COLUMNS}
          data={getParsedData()}
          isLoading={isGettingCompanyUsers}
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
              {!companyUsersResponse || !companyUsersResponse.data
                ? ""
                : `${companyUsersResponse.data.total_count} ${
                    companyUsersResponse.data.total_count === 1
                      ? "miembro"
                      : "miembros"
                  }`}
            </p>
          </div>
          <PaginationComponent
            page={page}
            pages={
              !companyUsersResponse || !companyUsersResponse.data
                ? 0
                : companyUsersResponse.data.total_pages
            }
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}
