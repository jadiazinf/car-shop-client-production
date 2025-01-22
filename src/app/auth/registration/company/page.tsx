import { useContext, useState } from "react";
import RegisterCompanyPageLayout from "./layout";
import { useDispatch } from "react-redux";
import { ToasterContext } from "../../../../components/toaster/context/context";
import UserContext from "../../../../entities/user/contexts/user";
import { StatusCodes } from "http-status-codes";
import { SetAuthentication } from "../../../../store/auth/reducers";
import { AuthStatus } from "../../../../auth/types";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody } from "@nextui-org/react";
import UserInfoForm from "../../../../entities/user/components/forms/user/component";
import UserModel from "../../../../entities/user/model";
import ButtonComponent from "../../../../components/buttons/component";
import UserInfo from "../../../../entities/user/components/info";
import { FaUser, FaUserCheck } from "react-icons/fa";
import { RiToolsFill } from "react-icons/ri";
import { BsPatchCheckFill } from "react-icons/bs";
import { usePersistedStore } from "../../../../store/store";
import CompanyInfoForm from "../../../../entities/company/components/forms/register/component";
import CompanyContext from "../../../../entities/company/contexts/company";
import CompanyModel from "../../../../entities/company/model";
import CompanyInfo from "../../../../entities/company/components/info";
import PlaceProvider from "../../../../entities/location/providers/place";
import { useUsersApiServices } from "../../../api/users";
import { useCompanyApiServices } from "../../../api/companies";
import { UserCompanyRole } from "../../../../entities/users_companies/types";

enum PageStage {
  USER = "user",
  WORKSHOP = "workshop",
  CONFIRM_USER_INFO = "confirm-user-info",
  CONFIRM_WORKSHOP_INFO = "confirm-workshop-info",
}

function Main() {
  const { authReducer } = usePersistedStore();

  const { status, sessionType, token } = authReducer;

  const [registerStage, setRegisterStage] = useState<PageStage>(PageStage.USER);

  const { user, setUser } = useContext(UserContext);

  const { company, setCompany } = useContext(CompanyContext);

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const appDispatch = useDispatch();

  const { isCreatingUser, perform: createUser } =
    useUsersApiServices.createGeneralUser();

  const { isCreatingCompany, perform: createCompany } =
    useCompanyApiServices.createCompany();

  function authenticateUser(
    user: UserModel,
    token: string,
    company_id: number | null,
    roles: UserCompanyRole[] | null
  ) {
    appDispatch(
      SetAuthentication({
        status: AuthStatus.AUTHENTICATED,
        token,
        sessionType: {
          company_id,
          roles,
          user,
        },
      })
    );

    toasterDispatch({
      payload: "Usuario autenticado con éxito",
      type: "SUCCESS",
    });
  }

  async function handleRegisterCompany(
    company: CompanyModel,
    user_id: number,
    token: string
  ): Promise<[boolean, CompanyModel | null]> {
    const companyResponse = await createCompany(company, user_id, token);

    if (companyResponse.status !== StatusCodes.CREATED) {
      toasterDispatch({
        payload: (companyResponse.data as { errors: string[] }).errors
          ? (companyResponse.data as { errors: string[] }).errors[0]
          : "Error al registrar compañía",
        type: "ERROR",
      });
      return [false, null];
    }

    toasterDispatch({
      payload: "Compañía registrada con éxito",
      type: "SUCCESS",
    });

    return [true, companyResponse.data as CompanyModel];
  }

  async function handleRegisterUser() {
    const response = await createUser(user!);
    if (response.status !== StatusCodes.CREATED) {
      toasterDispatch({
        payload: response.data.errors
          ? response.data.errors[0]
          : "Error al registrar usuario",
        type: "ERROR",
      });
      return;
    }

    const [registrationCompanyIsValid, newCompany] =
      await handleRegisterCompany(
        company!,
        response.data.user!.id!,
        response.data.token!
      );

    if (registrationCompanyIsValid) {
      authenticateUser(
        response.data.user!,
        response.data.token!,
        newCompany!.id!,
        [UserCompanyRole.ADMIN]
      );
    } else {
      authenticateUser(response.data.user!, response.data.token!, null, null);
    }
  }

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <Breadcrumbs
          underline="active"
          onAction={(key) => setRegisterStage(key as PageStage)}
        >
          {status === AuthStatus.NOT_AUTHENTICATED && (
            <BreadcrumbItem
              key={PageStage.USER}
              isCurrent={registerStage === PageStage.USER}
              startContent={<FaUser />}
            >
              Información de usuario
            </BreadcrumbItem>
          )}
          <BreadcrumbItem
            key={PageStage.WORKSHOP}
            isCurrent={registerStage === PageStage.WORKSHOP}
            startContent={<RiToolsFill />}
          >
            Información de taller
          </BreadcrumbItem>
          {status === AuthStatus.NOT_AUTHENTICATED && (
            <BreadcrumbItem
              key={PageStage.CONFIRM_USER_INFO}
              isCurrent={registerStage === PageStage.CONFIRM_USER_INFO}
              startContent={<FaUserCheck />}
            >
              Confirmar información de nuevo usuario
            </BreadcrumbItem>
          )}
          <BreadcrumbItem
            key={PageStage.CONFIRM_WORKSHOP_INFO}
            isCurrent={registerStage === PageStage.CONFIRM_WORKSHOP_INFO}
            startContent={<BsPatchCheckFill />}
          >
            Confirmar información de taller
          </BreadcrumbItem>
        </Breadcrumbs>
        <div className="mt-10 w-full flex justify-center items-center">
          <Card radius="sm" className="w-full lg:w-2/3 p-2 mb-10">
            <CardBody>
              <div className="w-full h-full flex justify-center items-center flex-col gap-5">
                {registerStage === PageStage.USER ? (
                  <div className="w-full lg:w-2/3 flex flex-col gap-3">
                    <div>
                      <span className="font-inter font-bold text-2xl">
                        Formulario de registro de usuario
                      </span>
                      <div className="hidden md:block md:w-1/6 bg-blue-600 h-1"></div>
                    </div>
                    <PlaceProvider>
                      <UserInfoForm
                        initialValues={user ? user : ({} as UserModel)}
                        onSubmit={(values) => {
                          setUser(values);
                          setRegisterStage(PageStage.WORKSHOP);
                        }}
                      >
                        <div className="w-full flex justify-end items-center">
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Siguiente"
                              type="submit"
                              variant="solid"
                            />
                          </div>
                        </div>
                      </UserInfoForm>
                    </PlaceProvider>
                  </div>
                ) : registerStage === PageStage.WORKSHOP ? (
                  <div className="w-full lg:w-2/3 flex flex-col gap-3">
                    <div>
                      <span className="font-inter font-bold text-2xl">
                        Formulario de registro de taller
                      </span>
                      <div className="hidden md:block md:w-1/6 bg-blue-600 h-1"></div>
                    </div>
                    <CompanyInfoForm
                      initialValues={company ? company : ({} as CompanyModel)}
                      onSubmit={(values) => {
                        setCompany(values);
                        setRegisterStage(
                          status === AuthStatus.NOT_AUTHENTICATED
                            ? PageStage.CONFIRM_USER_INFO
                            : PageStage.CONFIRM_WORKSHOP_INFO
                        );
                      }}
                    >
                      <div className="w-full flex justify-end items-center">
                        {status === AuthStatus.NOT_AUTHENTICATED && (
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Regresar"
                              type="button"
                              variant="light"
                              onClick={() => setRegisterStage(PageStage.USER)}
                            />
                          </div>
                        )}
                        <div className="w-auto">
                          <ButtonComponent
                            color="primary"
                            text="Siguiente"
                            type="submit"
                            variant="solid"
                          />
                        </div>
                      </div>
                    </CompanyInfoForm>
                  </div>
                ) : registerStage === PageStage.CONFIRM_USER_INFO ? (
                  <div className="w-full">
                    {user ? (
                      <div className="flex flex-col gap-5 w-full">
                        <div>
                          <span className="font-inter font-bold text-2xl">
                            Información de nuevo usuario
                          </span>
                          <div className="hidden md:block md:w-1/6 bg-blue-600 h-1"></div>
                        </div>
                        <UserInfo user={user} />
                        <div className="flex justify-end items-center">
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Regresar"
                              type="button"
                              variant="light"
                              onClick={() =>
                                setRegisterStage(PageStage.WORKSHOP)
                              }
                            />
                          </div>
                          <div className="flex justify-center items-center">
                            <div className="w-auto">
                              <ButtonComponent
                                color="primary"
                                text="Siguiente"
                                type="button"
                                variant="solid"
                                onClick={() =>
                                  setRegisterStage(
                                    PageStage.CONFIRM_WORKSHOP_INFO
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span>Debe llenar el formulario de usuario</span>
                    )}
                  </div>
                ) : registerStage === PageStage.CONFIRM_WORKSHOP_INFO ? (
                  <div className="w-full">
                    {company ? (
                      <div className="w-full flex flex-col gap-5">
                        <div>
                          <span className="font-inter font-bold text-2xl">
                            Información de nueva companía
                          </span>
                          <div className="hidden md:block md:w-1/6 bg-blue-600 h-1"></div>
                        </div>
                        <CompanyInfo
                          company={company}
                          showChangeAvatar={false}
                          imagesAreCommingFrom="client"
                        />
                        <div className="w-full flex justify-end items-center gap-5">
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Regresar"
                              type="button"
                              variant="light"
                              onClick={() =>
                                setRegisterStage(
                                  status === AuthStatus.NOT_AUTHENTICATED
                                    ? PageStage.CONFIRM_USER_INFO
                                    : PageStage.WORKSHOP
                                )
                              }
                              isDisabled={isCreatingUser || isCreatingCompany}
                            />
                          </div>
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Confirmar registro"
                              type="button"
                              variant="solid"
                              onClick={
                                status === AuthStatus.NOT_AUTHENTICATED
                                  ? handleRegisterUser
                                  : () =>
                                      handleRegisterCompany(
                                        company!,
                                        sessionType!.user.id!,
                                        token!
                                      )
                              }
                              isLoading={isCreatingUser || isCreatingCompany}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span>Debe llenar el formulario de empresa</span>
                    )}
                  </div>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function RegisterCompanyPage() {
  return (
    <RegisterCompanyPageLayout>
      <Main />
    </RegisterCompanyPageLayout>
  );
}

export default RegisterCompanyPage;
