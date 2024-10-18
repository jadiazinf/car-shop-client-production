import { useContext, useEffect, useState } from "react";
import RegisterGeneralUserPageLayout from "./layout";
import UserInfoForm from "../../../../entities/user/components/forms/user/component";
import VehicleInfoForm from "../../../../entities/vehicle/components/forms/vehicle/component";
import UserInfo from "../../../../entities/user/components/info";
import UserContext from "../../../../entities/user/contexts/user";
import VehicleContext from "../../../../entities/vehicle/contexts/vehicle";
import UserModel from "../../../../entities/user/model";
import VehicleModel from "../../../../entities/vehicle/model";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody } from "@nextui-org/react";
import ButtonComponent from "../../../../components/buttons/component";
import { FaUser, FaUserCheck } from "react-icons/fa";
import { MdCarCrash, MdDirectionsCar } from "react-icons/md";
import VehicleInfo from "../../../../entities/vehicle/components/info";
import BrandAndModelContext from "../../../../entities/model/contexts/brand_and_model";
import useRegisterUser, { RegisterUserProps } from "../../../../entities/user/services/registration/use_register";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../../components/toaster/context/context";
import { useDispatch } from "react-redux";
import { SetAuthentication } from "../../../../store/auth/reducers";
import { AuthStatus } from "../../../../auth/types";
import useRegisterVehicle, { RegisterVehicleProps } from "../../../../entities/vehicle/services/register/use_register";

enum PageStage {
  USER = "user",
  VEHICLE = "vehicle",
  CONFIRM_USER_INFO = "confirm-user-info",
  CONFIRM_VEHICLE_INFO = "confirm-vehicle-info"
};

function Main() {

  const [ registerStage, setRegisterStage ] = useState<PageStage>(PageStage.USER);

  const { user, setUser } = useContext(UserContext);

  const { vehicle, setVehicle } = useContext(VehicleContext);

  const { brandAndModel } = useContext(BrandAndModelContext);

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const appDispatch = useDispatch();

  const { isRegisteringUserLoading, payloadState, performRegisterUser } = useRegisterUser();

  const { isRegisteringVehicleLoading, payloadState: vehiclePayload, performRegisterVehicle } = useRegisterVehicle();

  async function handleRegisterUser() {
    await performRegisterUser({user: user!});
  }

  async function handleService() {
    if ((payloadState as RegisterUserProps).status !== StatusCodes.OK && (payloadState as RegisterUserProps).status !== StatusCodes.CREATED) {
      toasterDispatch({payload: (payloadState as RegisterUserProps).errorMessage || 'Error al registrar usuario', type: 'ERROR'});
      return;
    }

    const user = (payloadState as RegisterUserProps).payload;
    const token = (payloadState as RegisterUserProps).token;

    await performRegisterVehicle({
      token: token!,
      vehicle: {
        ...vehicle!,
        user_id: user.id!,
        model_id: brandAndModel!.model!.id
      }});
  }

  async function handleVehicleService() {
    if ((vehiclePayload as RegisterVehicleProps).status !== StatusCodes.OK && (vehiclePayload as RegisterVehicleProps).status !== StatusCodes.CREATED)
      toasterDispatch({payload: (vehiclePayload as RegisterVehicleProps).errorMessage || 'Error al registrar vehiculo', type: 'ERROR'});
    else
      toasterDispatch({payload: "Vehículo registrado con éxito", type: 'SUCCESS'});

    authenticateUser();
  }

  function authenticateUser() {
    appDispatch(SetAuthentication({
      status: AuthStatus.AUTHENTICATED,
      token: (payloadState as RegisterUserProps).token,
      sessionType: {
        company_id: null,
        roles: null,
        user: (payloadState as RegisterUserProps).payload
      }
    }));
    toasterDispatch({payload: "Usuario autenticado con éxito", type: 'SUCCESS'});
  }

  useEffect(() => {
    if (payloadState !== 'not loaded')
      handleService();
  }, [payloadState]);

  useEffect(() => {
    if (vehiclePayload !== 'not loaded')
      handleVehicleService();
  }, [vehiclePayload]);

  return (
    <>
      <div className='w-full h-full flex flex-col mt-10'>
        <Breadcrumbs underline="active" onAction={(key) => setRegisterStage(key as PageStage)}>
          <BreadcrumbItem key={PageStage.USER} isCurrent={registerStage === PageStage.USER} startContent={<FaUser />}>
            Información de usuario
          </BreadcrumbItem>
          <BreadcrumbItem key={PageStage.VEHICLE} isCurrent={registerStage === PageStage.VEHICLE} startContent={<MdDirectionsCar />}>
            Información de vehículo
          </BreadcrumbItem>
          <BreadcrumbItem key={PageStage.CONFIRM_USER_INFO} isCurrent={registerStage === PageStage.CONFIRM_USER_INFO} startContent={<FaUserCheck />}>
            Confirmar usuario
          </BreadcrumbItem>
          <BreadcrumbItem key={PageStage.CONFIRM_VEHICLE_INFO} isCurrent={registerStage === PageStage.CONFIRM_VEHICLE_INFO} startContent={<MdCarCrash />}>
            Confirmar vehículo
          </BreadcrumbItem>
        </Breadcrumbs>
        <div className='mt-10 w-full flex justify-center items-center'>
          <Card radius='sm' className='md:w-4/6 lg:w-1/2 p-10'>
            <CardBody>
              <div className='w-full h-full flex justify-center items-center flex-col gap-5'>
                {
                  registerStage === PageStage.USER ?
                    <div className='w-full flex flex-col gap-3'>
                      <div>
                        <span className='font-inter font-bold text-2xl'>Formulario de registro de usuario</span>
                        <div className='hidden md:block md:w-1/6 bg-blue-600 h-1'></div>
                      </div>
                      <UserInfoForm
                        initialValues={user ? user : {} as UserModel}
                        onSubmit={(values) => {
                          setUser(values);
                          setRegisterStage(PageStage.VEHICLE);
                        }}
                      >
                        <div className='w-full flex justify-center items-center'>
                          <div className='w-1/2'>
                            <ButtonComponent
                              color="primary"
                              text="Siguiente"
                              type="submit"
                              variant="solid"
                            />
                          </div>
                        </div>
                      </UserInfoForm>
                    </div>
                  :
                  registerStage === PageStage.VEHICLE ?
                    <div className='w-full flex flex-col gap-3'>
                      <div>
                        <span className='font-inter font-bold text-2xl'>Formulario de registro de vehículo</span>
                        <div className='hidden md:block md:w-1/6 bg-blue-600 h-1'></div>
                      </div>
                      <VehicleInfoForm
                        initialValues={vehicle ? vehicle : {} as VehicleModel}
                        onSubmit={(values) => {
                          setVehicle(values);
                          setRegisterStage(PageStage.CONFIRM_USER_INFO);
                        }}
                      >
                        <div className='w-full flex justify-center items-center'>
                          <div className='w-1/2 flex flex-col gap-3'>
                            <ButtonComponent
                              color="primary"
                              text="Siguiente"
                              type="submit"
                              variant="solid"
                            />
                            <ButtonComponent
                              color="primary"
                              text="Regresar"
                              type="button"
                              variant="light"
                              onClick={() => setRegisterStage(PageStage.USER)}
                            />
                          </div>
                        </div>
                      </VehicleInfoForm>
                    </div>
                  :
                  registerStage === PageStage.CONFIRM_USER_INFO ?
                    <div>
                      {
                        user ?
                        <div className='flex flex-col gap-5'>
                          <UserInfo user={user}/>
                          <div className='w-full flex flex-col gap-3'>
                            <ButtonComponent
                              color="primary"
                              text="Siguiente"
                              type="button"
                              variant="solid"
                              onClick={() => setRegisterStage(PageStage.CONFIRM_VEHICLE_INFO)}
                            />
                            <ButtonComponent
                              color="primary"
                              text="Regresar"
                              type="button"
                              variant="light"
                              onClick={() => setRegisterStage(PageStage.VEHICLE)}
                            />
                          </div>
                        </div>
                        :
                          <span>Debe llenar el formulario de usuario</span>
                      }
                    </div>
                  :
                  registerStage === PageStage.CONFIRM_VEHICLE_INFO ?
                    <div>
                      {
                        vehicle ?
                          <div className='flex flex-col gap-5'>
                            <VehicleInfo
                              vehicle={{
                                ...vehicle,
                                model: {
                                  ...brandAndModel!.model!,
                                  brand: brandAndModel!.brand!
                                }
                              }}
                            />
                            <div className='w-full flex flex-col gap-3'>
                              <ButtonComponent
                                color="primary"
                                text="Confirmar registro"
                                type="button"
                                variant="solid"
                                onClick={handleRegisterUser}
                                isLoading={isRegisteringUserLoading || isRegisteringVehicleLoading}
                              />
                              <ButtonComponent
                                color="primary"
                                text="Regresar"
                                type="button"
                                variant="light"
                                onClick={() => setRegisterStage(PageStage.CONFIRM_USER_INFO)}
                                isDisabled={isRegisteringUserLoading || isRegisteringVehicleLoading}
                              />
                            </div>
                          </div>
                        :
                          <span>Debe llenar el formulario de vehículo</span>
                      }
                    </div>
                  : null
                }
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function RegisterGeneralUserPage() {

  return (
    <RegisterGeneralUserPageLayout>
      <Main />
    </RegisterGeneralUserPageLayout>
  );
}

export default RegisterGeneralUserPage;
