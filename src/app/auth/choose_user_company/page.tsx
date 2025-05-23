import { useContext, useEffect, useState } from "react";
import { useUsersApiServices } from "../../api/users";
import { usePersistedStore } from "../../../store/store";
import DatatableComponent from "../../../components/datatable/component";
import DatesHelpers from '../../../helpers/dates/helper';
import { useNavigate } from "react-router-dom";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import PaginationComponent from "../../../components/datatable/pagination";
import { DatatableColumnsProps } from "../../../components/datatable/types";
import WindowLoader from '../../../components/window/loader';
import { useUsersCompaniesApiServices } from "../../api/users_companies";
import { StatusCodes } from "http-status-codes";
import { useDispatch } from "react-redux";
import { SetAuthentication } from "../../../store/auth/reducers";
import { AuthStatus } from "../../../auth/types";
import { ToasterContext } from "../../../components/toaster/context/context";

const DATATABLE_COLUMNS: DatatableColumnsProps[] = [
  { key: "name", label: "Compañía" },
  { key: "rif", label: "RIF" },
  { key: "address", label: "Dirección" },
  { key: "phone_numbers", label: "Teléfono" },
  { key: "created_at", label: "Fecha de creación" },
  { key: "is_active", label: "Estatus" },
  { key: "action", label: "Acción" }
];

export default function ChooseUserCompanyPage() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const [ componentMounted, setComponentMounted ] = useState<boolean>(false);

  const [ isSettingSession, setIsSettingSession ] = useState(true);

  const { perform, isGettingCompanies, userCompaniesResponse } = useUsersApiServices.getUserCompanies();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const { perform: getUserCompany } = useUsersCompaniesApiServices.getUserCompanyByUserAndCompany();

  const [workshopsFilters, setWorkshopsFilters] = useState<{name: string, rif: string, status: boolean | "", page: number}>({
    name: "",
    rif: "",
    status: "",
    page: 1,
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    perform(token!, { ...workshopsFilters });
  }, [workshopsFilters]);

  useEffect(() => {
    if (userCompaniesResponse && !componentMounted) {
      handleComponentMounted();
      setComponentMounted(true);
    }
  }, [userCompaniesResponse, componentMounted]);

  async function handleComponentMounted() {
    console.log("userCompaniesResponse", userCompaniesResponse);
    if (userCompaniesResponse?.data?.data.length === 0) {
      dispatch(SetAuthentication({
        status: AuthStatus.AUTHENTICATED,
        token: token!,
        sessionType: {
          roles: null,
          user: sessionType!.user,
          user_company_id: null,
          company_id: null,
        }
      }));
      navigate("/");
    }
    if (userCompaniesResponse?.data?.data.length === 1) {
      const response = await getUserCompany(sessionType!.user.id!, userCompaniesResponse?.data?.data[0].id!, token!);
      dispatch(SetAuthentication({
        status: AuthStatus.AUTHENTICATED,
        token: token!,
        sessionType: {
          roles: response.data?.user_company?.roles || null,
          user: sessionType!.user,
          user_company_id: response.data?.user_company?.id || null,
          company_id: response.data?.user_company?.company_id || null,
        }
      }));
      navigate("/");
    }

    setIsSettingSession(false);
  }

  async function onRowSelection(company_id: number) {
    setIsSettingSession(true);
    const response = await getUserCompany(sessionType!.user.id!, company_id, token!);
    if (response.status === StatusCodes.OK) {
      dispatch(SetAuthentication({
        status: AuthStatus.AUTHENTICATED,
        token: token!,
        sessionType: {
          roles: response.data!.user_company!.roles,
          user: sessionType!.user,
          user_company_id: response.data!.user_company!.id!,
          company_id,
        }
      }));
      navigate("/");
    } else {
      toasterDispatch({
        type: "ERROR",
        payload: "Error al seleccionar el taller",
      });
      setIsSettingSession(false);
    }
  }

  return isSettingSession ? <WindowLoader /> : (
    <div className="w-full h-full">
      <p className="font-inter font-semibold text-2xl w-full text-center md:text-start mb-5">Selecciona un taller para la sessión</p>
      <div className="w-full flex flex-col gap-3 md:flex-row justify-center items-center mb-4">
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
          <SelectItem key="">Todos</SelectItem>
          <SelectItem key="active">Activo</SelectItem>
          <SelectItem key="inactive">Inactivo</SelectItem>
        </Select>
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
          action: <Button size="md" radius="sm" color="primary" variant="solid" onPress={() => onRowSelection(item.id!)}>Seleccionar</Button>
        })) || []}
        isLoading={isGettingCompanies}
      />
      <div className="w-full flex justify-end mt-5">
        <PaginationComponent
          page={workshopsFilters.page}
          pages={userCompaniesResponse?.data?.total_pages || 0}
          setPage={(page) => setWorkshopsFilters({ ...workshopsFilters, page })}
        />
      </div>
    </div>
  )
}
