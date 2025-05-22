import { useContext, useEffect, useState } from "react";
import { useUsersApiServices } from "../../api/users";
import { usePersistedStore } from "../../../store/store";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import { DatatableColumnsProps } from "../../../components/datatable/types";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import DatatableComponent from "../../../components/datatable/component";
import DatesHelpers from '../../../helpers/dates/helper';
import ButtonComponent from "../../../components/buttons/component";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Input, Select, SelectItem } from "@heroui/react";
import PaginationComponent from "../../../components/datatable/pagination";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Perfil",
    url: "/profile",
  },
  {
    text: "Mis compañías",
    url: "/profile/workshops",
  },
];

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "name", label: "Compañía" },
  { key: "rif", label: "RIF" },
  { key: "address", label: "Dirección" },
  { key: "phone_numbers", label: "Teléfono" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "is_active", label: "Estatus" },
];

export function UserWorkshopsPage() {
  const { token } = usePersistedStore().authReducer;

  const { perform, isGettingCompanies, userCompaniesResponse } = useUsersApiServices.getUserCompanies();

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [workshopsFilters, setWorkshopsFilters] = useState<{name: string, rif: string, status: boolean, page: number}>({
    name: "",
    rif: "",
    status: true,
    page: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  useEffect(() => {
    perform(token!, { ...workshopsFilters });
  }, [workshopsFilters]);

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col gap-3 lg:flex-row justify-center md:justify-between items-center mb-4">
        <p className="font-inter font-semibold text-2xl w-full text-center md:text-start">Mis talleres</p>
        <Input
          label="Nombre del taller"
          radius="sm"
          size="sm"
          variant="bordered"
          name="name"
          type="text"
          onChange={(e) => setWorkshopsFilters({ ...workshopsFilters, name: e.target.value })}
          value={workshopsFilters.name}
        />
        <Input
          label="Rif del taller"
          radius="sm"
          size="sm"
          variant="bordered"
          name="rif"
          type="text"
          onChange={(e) => setWorkshopsFilters({ ...workshopsFilters, rif: e.target.value })}
          value={workshopsFilters.rif}
        />
        <Select
          name="status"
          radius="sm"
          size="sm"
          variant="bordered"
          label="Estatus"
          onChange={(e) => setWorkshopsFilters({ ...workshopsFilters, status: e.target.value === "active" })}
          value={workshopsFilters.status ? "Activo" : "Inactivo"}
        >
          <SelectItem key="active">Activo</SelectItem>
          <SelectItem key="inactive">Inactivo</SelectItem>
        </Select>
        <div className="flex w-full lg:w-auto">
          <ButtonComponent
            color="primary"
            text="Registrar nueva compañía"
            type="button"
            variant="solid"
            startContent={<IoAdd className="w-5 h-5" />}
            onClick={() => navigate("/profile/workshops/new")}
          />
        </div>
      </div>
      <DatatableComponent
        columns={DATATABLE_COLUMNS}
        data={userCompaniesResponse?.data?.data?.map(item => ({
          id: item.id,
          rif: item.dni,
          phone_numbers: item.phone_numbers?.join(", "),
          name: item.name,
          address: item.address,
          created_at: DatesHelpers.formatFullDate(item.created_at || ""),
          is_active: item.is_active ? "Activo" : "Inactivo",
        })) || []}
        isLoading={isGettingCompanies}
      />
      <div className="w-full flex justify-end">
        <PaginationComponent
          page={workshopsFilters.page}
          pages={userCompaniesResponse?.data?.total_pages || 0}
          setPage={(page) => setWorkshopsFilters({ ...workshopsFilters, page })}
        />
      </div>
    </div>
  );
}
