import { useContext, useEffect, useState } from "react";
import RegisterCompanyPageLayout from "./layout";
import { useDispatch } from "react-redux";
import { ToasterContext } from "../../../../components/toaster/context/context";
import UserContext from "../../../../entities/user/contexts/user";
import useRegisterUser, {
  RegisterUserProps,
} from "../../../../entities/user/services/registration/use_register";
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
import useCreateCompany, {
  CreateCompanyProps,
} from "../../../../entities/company/services/create/use_create";
import CompanyInfoForm from "../../../../entities/company/components/forms/register/component";
import CompanyContext from "../../../../entities/company/contexts/company";
import CompanyModel from "../../../../entities/company/model";
import CompanyInfo from "../../../../entities/company/components/info";
import PlaceProvider from "../../../../entities/location/providers/place";

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

  const { isRegisteringUserLoading, payloadState, performRegisterUser } =
    useRegisterUser();

  const {
    isCreatingCompanyLoading,
    payloadState: companyPayload,
    performCreateCompany,
  } = useCreateCompany();

  async function handleRegisterUser() {
    await performRegisterUser({ user: user! });
  }

  async function handleRegisterUserService() {
    if (
      (payloadState as RegisterUserProps).status !== StatusCodes.OK &&
      (payloadState as RegisterUserProps).status !== StatusCodes.CREATED
    ) {
      toasterDispatch({
        payload:
          (payloadState as RegisterUserProps).errorMessage ||
          "Error al registrar usuario",
        type: "ERROR",
      });
      return;
    }

    const user = (payloadState as RegisterUserProps).payload;
    const token = (payloadState as RegisterUserProps).token;

    performCreateCompany({
      company: company!,
      token: token!,
      user_id: user.id!,
    });
  }

  async function handleCompanyService() {
    if (
      (companyPayload as CreateCompanyProps).status !== StatusCodes.OK &&
      (companyPayload as CreateCompanyProps).status !== StatusCodes.CREATED
    )
      toasterDispatch({
        payload:
          (companyPayload as CreateCompanyProps).errorMessage ||
          "Error al registrar compañía",
        type: "ERROR",
      });
    else
      toasterDispatch({
        payload: "Compañía registrada con éxito",
        type: "SUCCESS",
      });

    if (status === AuthStatus.NOT_AUTHENTICATED) authenticateUser();
  }

  function authenticateUser() {
    appDispatch(
      SetAuthentication({
        status: AuthStatus.AUTHENTICATED,
        token: (payloadState as RegisterUserProps).token,
        sessionType: {
          company_id: null,
          roles: null,
          user: (payloadState as RegisterUserProps).payload,
        },
      })
    );

    toasterDispatch({
      payload: "Usuario autenticado con éxito",
      type: "SUCCESS",
    });
  }

  useEffect(() => {
    if (payloadState !== "not loaded") handleRegisterUserService();
  }, [payloadState]);

  useEffect(() => {
    if (companyPayload !== "not loaded") handleCompanyService();
  }, [companyPayload]);

  return (
    <>
      <div className="w-full h-full flex flex-col mt-10">
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
          <Card radius="sm" className="md:w-4/6 lg:w-1/2 p-10">
            <CardBody>
              <div className="w-full h-full flex justify-center items-center flex-col gap-5">
                {registerStage === PageStage.USER ? (
                  <div className="w-full flex flex-col gap-3">
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
                        <div className="w-full flex justify-center items-center">
                          <div className="w-1/2">
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
                  <div className="w-full flex flex-col gap-3">
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
                      <div className="w-full flex justify-center items-center">
                        <div className="w-1/2 flex flex-col gap-3">
                          <ButtonComponent
                            color="primary"
                            text="Siguiente"
                            type="submit"
                            variant="solid"
                          />
                          {status === AuthStatus.NOT_AUTHENTICATED && (
                            <ButtonComponent
                              color="primary"
                              text="Regresar"
                              type="button"
                              variant="light"
                              onClick={() => setRegisterStage(PageStage.USER)}
                            />
                          )}
                        </div>
                      </div>
                    </CompanyInfoForm>
                  </div>
                ) : registerStage === PageStage.CONFIRM_USER_INFO ? (
                  <div>
                    {user ? (
                      <div className="flex flex-col gap-5">
                        <UserInfo user={user} />
                        <div className="w-full flex flex-col gap-3">
                          <ButtonComponent
                            color="primary"
                            text="Siguiente"
                            type="button"
                            variant="solid"
                            onClick={() =>
                              setRegisterStage(PageStage.CONFIRM_WORKSHOP_INFO)
                            }
                          />
                          <ButtonComponent
                            color="primary"
                            text="Regresar"
                            type="button"
                            variant="light"
                            onClick={() => setRegisterStage(PageStage.WORKSHOP)}
                          />
                        </div>
                      </div>
                    ) : (
                      <span>Debe llenar el formulario de usuario</span>
                    )}
                  </div>
                ) : registerStage === PageStage.CONFIRM_WORKSHOP_INFO ? (
                  <div>
                    {company ? (
                      <div className="w-full flex flex-col gap-5">
                        <CompanyInfo company={company} />
                        <div className="w-full flex flex-col gap-3">
                          <ButtonComponent
                            color="primary"
                            text="Confirmar registro"
                            type="button"
                            variant="solid"
                            onClick={
                              status === AuthStatus.NOT_AUTHENTICATED
                                ? handleRegisterUser
                                : () =>
                                    performCreateCompany({
                                      company: company!,
                                      token: token!,
                                      user_id: sessionType!.user.id!,
                                    })
                            }
                            isLoading={
                              isRegisteringUserLoading ||
                              isCreatingCompanyLoading
                            }
                          />
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
                            isDisabled={
                              isRegisteringUserLoading ||
                              isCreatingCompanyLoading
                            }
                          />
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
