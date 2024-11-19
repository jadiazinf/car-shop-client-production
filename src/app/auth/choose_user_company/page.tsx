import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { PersistedStore } from "../../../store/types";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { StatusCodes } from "http-status-codes";
import useGetUserCompanies, { GetUserCompaniesProps } from "../../../entities/user/services/companies/use_get_companies";
import { UserCompanyRole } from "../../../entities/users_companies/types";
import ButtonComponent from "../../../components/buttons/component";
import { SetAuthentication } from "../../../store/auth/reducers";
import { AuthStatus } from "../../../auth/types";
import useGetUserCompanyRolesService, { GetUserCompanyRolesProps } from "../../../entities/users_companies/services/user_company_roles/get/use_service";
import { ToasterContext } from "../../../components/toaster/context/context";
import CompanyCardBasicInfo from "../../../entities/company/components/card_basic_info";

function ChooseUserCompanyPage() {

  const navigate = useNavigate();

  const appDispatch = useDispatch();

  const { authReducer } = useSelector((state: RootState):PersistedStore => state.persistedReducer);

  const { token, sessionType } = authReducer;

  const { isGettingUserCompaniesLoading, performGetUserCompanies, payloadState } = useGetUserCompanies();

  const { isGettingUserCompanyRolesLoading, payloadState: userCompanyRolesPayload, performGetRole } = useGetUserCompanyRolesService();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const [ selectedCompany, setSelectedCompany ] = useState<null | number>(null);

  function setUserCompanyRoles() {
    const { payload, status } = userCompanyRolesPayload as unknown as GetUserCompanyRolesProps;

    if (status === StatusCodes.OK || status === StatusCodes.NOT_MODIFIED) {
      if ( payload.length === 0 ) {
        toasterDispatch({payload: 'No tiene rol definido para dicha compañía, por favor comuníquese con el administrador', type: 'ERROR'});
        navigate('/auth/logout');
        return;
      }

      appDispatch(SetAuthentication({
        sessionType: {
          company_id: selectedCompany as number,
          roles: payload,
          user: sessionType!.user!
        },
        status: AuthStatus.AUTHENTICATED,
        token: token!
      }));
      navigate('/');
      return;
    }

    toasterDispatch({payload: 'Error al obtener los roles para la companía seleccionada', type: 'ERROR'});
    navigate('/auth/logout');
    return;
  }

  async function getUserCompanyRoles(company_id: number) {
    await performGetRole({company_id, token: token!});
    setSelectedCompany(company_id);
  }

  function handler(data: GetUserCompaniesProps) {
    if (data.payload.length === 0) {
      appDispatch(SetAuthentication({
        sessionType: {
          user: sessionType!.user,
          company_id: null,
          roles: null
        },
        status: AuthStatus.AUTHENTICATED,
        token: token!
      }));
      return;
    }

    if (data.payload.length === 1)
      getUserCompanyRoles(data.payload[0].id!);
  }

  useEffect(() => {
    if (!sessionType || (sessionType.roles?.length === 1 && sessionType.roles?.includes(UserCompanyRole.GENERAL))) {
      navigate("/");
      return;
    }
    performGetUserCompanies({user_id: sessionType!.user.id!, token: token!}, handler);
  }, []);

  useEffect(() => {
    if (userCompanyRolesPayload !== 'not loaded')
      setUserCompanyRoles();
  }, [userCompanyRolesPayload])

  return (
    <div className='w-full h-full-w-footer flex flex-col justify-center items-center'>
      {
        isGettingUserCompaniesLoading || payloadState === "not loaded" || isGettingUserCompanyRolesLoading ? <Spinner /> :
        payloadState.status !== StatusCodes.OK ? <span>No hay data</span> :
        payloadState.payload.map( (company, index) => (
            <div key={index} onClick={() => getUserCompanyRoles(company.id!)}>
              <CompanyCardBasicInfo company={company}/>
            </div>
          )
        )
      }
      {
        isGettingUserCompaniesLoading || payloadState === "not loaded" || isGettingUserCompanyRolesLoading ? null :
        <div className='mt-5 justify-center items-center w-auto'>
          <ButtonComponent
            color="primary"
            text="Cerrar sesión"
            type="button"
            variant="light"
            onClick={() => navigate("/auth/logout")}
          />
        </div>
      }
    </div>
  );

}

export default ChooseUserCompanyPage;
