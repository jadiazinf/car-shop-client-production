import { useContext, useState } from "react";
import RegisterGeneralUserPageLayout from "./layout";
import UserInfoForm from "../../../../entities/user/components/forms/user/component";
import VehicleInfoForm from "../../../../entities/vehicle/components/forms/vehicle/component";
import UserInfo from "../../../../entities/user/components/info";
import UserContext from "../../../../entities/user/contexts/user";
import VehicleContext from "../../../../entities/vehicle/contexts/vehicle";
import UserModel from "../../../../entities/user/model";
import VehicleModel from "../../../../entities/vehicle/model";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import ButtonComponent from "../../../../components/buttons/component";
import { FaUser, FaUserCheck } from "react-icons/fa";
import { MdCarCrash, MdDirectionsCar } from "react-icons/md";
import VehicleInfo from "../../../../entities/vehicle/components/info";
import BrandAndModelContext from "../../../../entities/model/contexts/brand_and_model";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../../components/toaster/context/context";
import { useDispatch } from "react-redux";
import { SetAuthentication } from "../../../../store/auth/reducers";
import { AuthStatus } from "../../../../auth/types";
import { useVehicleApiServices } from "../../../api/vehicles";
import { useUsersApiServices } from "../../../api/users";
import { useUserReferralsApiServices } from "../../../api/user_referrals";
import LogoComponent from "../../../../components/logo/component";
import SelectComponent from "../../../../components/inputs/select";
import { UserReferralsHelpers } from "../../../../entities/user_referrals/helpers";
import { UserReferralBy } from "../../../../entities/user_referrals/types";

enum PageStage {
  USER = "user",
  VEHICLE = "vehicle",
  CONFIRM_USER_INFO = "confirm-user-info",
  CONFIRM_VEHICLE_INFO = "confirm-vehicle-info",
}

function Main() {
  const [registerStage, setRegisterStage] = useState<PageStage>(PageStage.USER);

  const { user, setUser } = useContext(UserContext);

  const { vehicle, setVehicle } = useContext(VehicleContext);

  const { brandAndModel } = useContext(BrandAndModelContext);

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const { isCreatingUserReferral, perform } =
    useUserReferralsApiServices.createUserReferral();

  const [referralByState, setReferralByState] = useState<UserReferralBy>(
    UserReferralBy.FRIEND
  );

  const appDispatch = useDispatch();

  const { isCreatingUser, perform: performCreateUser } =
    useUsersApiServices.createGeneralUser();

  const { attachImages: attachVehicleImages, createVehicle } =
    useVehicleApiServices;

  const { isCreatingVehicle, perform: performCreateVehicle } = createVehicle();

  const { isAttachingImages, perform: performAttachVehicleImages } =
    attachVehicleImages();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function authenticateUser(user: UserModel, token: string) {
    appDispatch(
      SetAuthentication({
        status: AuthStatus.AUTHENTICATED,
        token,
        sessionType: {
          company_id: null,
          roles: null,
          user,
          user_company_id: null,
        },
      })
    );
    toasterDispatch({
      payload: "Usuario autenticado con éxito",
      type: "SUCCESS",
    });
  }

  async function registerUser(
    user: UserModel
  ): Promise<[boolean, string | null | UserModel, string | null]> {
    const response = await performCreateUser(user);
    if (response.status === StatusCodes.CREATED)
      return [true, response.data.user as UserModel, response.data.token];

    return [false, response.data.errors![0], null];
  }

  async function registerUserVehicle(
    vehicle: VehicleModel,
    user_id: number,
    token: string
  ): Promise<[boolean, string | null | VehicleModel]> {
    const response = await performCreateVehicle(vehicle, token, user_id);
    if (response.status === StatusCodes.CREATED)
      return [true, response.data as VehicleModel];

    return [false, (response.data as { errors: string[] }).errors[0]];
  }

  async function setVehicleImages(
    id: number,
    images: File[],
    token: string
  ): Promise<[boolean, VehicleModel | string | null]> {
    const response = await performAttachVehicleImages(id, images, token);
    if (response.status === StatusCodes.OK) return [true, response.data];

    return [false, response.data];
  }

  async function handleRegistration() {
    const [userIsRegisteredSuccessfully, newUser, token] = await registerUser(
      user!
    );
    if (!userIsRegisteredSuccessfully) {
      toasterDispatch({
        payload: newUser as string,
        type: "ERROR",
      });
      return;
    } else {
      if (typeof newUser !== "string") {
        if (newUser && newUser.id !== undefined) {
          perform(newUser.id, referralByState);
        }
      }
      toasterDispatch({
        payload: "Usuario registrado correctamente",
        type: "SUCCESS",
      });
    }

    const [vehicleIsRegisteredSuccessfully, newVehicle] =
      await registerUserVehicle(
        { ...(vehicle as VehicleModel), model_id: brandAndModel!.model!.id! },
        (newUser as UserModel).id!,
        token!
      );

    if (!vehicleIsRegisteredSuccessfully) {
      toasterDispatch({
        payload: (newVehicle as string) || "Vehículo no pudo ser registrado",
        type: "ERROR",
      });
    } else {
      const [imagesAreAttached] = await setVehicleImages(
        (newVehicle as VehicleModel).id!,
        vehicle!.vehicle_images as File[],
        token!
      );
      if (!imagesAreAttached) {
        toasterDispatch({
          payload: "Imágenes del vehículo no pudieron ser almacenadas",
          type: "ERROR",
        });
      }
    }

    authenticateUser(newUser as UserModel, token!);
  }

  return (
    <>
      <Modal
        className="p-5"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent>
            <div className="w-full h-full flex justify-center items-center flex-col gap-5">
              <LogoComponent />
              <p>¿Cómo conoció la plataforma?</p>
              <div className="w-full">
                <SelectComponent
                  data={UserReferralsHelpers.referralValues.map((option) => ({
                    key: option,
                    label: UserReferralsHelpers.translateUserReferralsHelpers(
                      option as UserReferralBy
                    ),
                  }))}
                  name="referral"
                  onChange={(value) =>
                    setReferralByState(value.target.value as UserReferralBy)
                  }
                  value={referralByState}
                  label="Seleccione una opción"
                />
              </div>
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Confirmar registro"
                  type="button"
                  variant="solid"
                  onClick={handleRegistration}
                  isLoading={
                    isCreatingUser ||
                    isCreatingVehicle ||
                    isAttachingImages ||
                    isCreatingUserReferral
                  }
                />
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full h-full flex flex-col">
        <Breadcrumbs
          underline="active"
          onAction={(key) => setRegisterStage(key as PageStage)}
        >
          <BreadcrumbItem
            key={PageStage.USER}
            isCurrent={registerStage === PageStage.USER}
            startContent={<FaUser />}
          >
            Información de usuario
          </BreadcrumbItem>
          <BreadcrumbItem
            key={PageStage.VEHICLE}
            isCurrent={registerStage === PageStage.VEHICLE}
            startContent={<MdDirectionsCar />}
          >
            Información de vehículo
          </BreadcrumbItem>
          <BreadcrumbItem
            key={PageStage.CONFIRM_USER_INFO}
            isCurrent={registerStage === PageStage.CONFIRM_USER_INFO}
            startContent={<FaUserCheck />}
          >
            Confirmar usuario
          </BreadcrumbItem>
          <BreadcrumbItem
            key={PageStage.CONFIRM_VEHICLE_INFO}
            isCurrent={registerStage === PageStage.CONFIRM_VEHICLE_INFO}
            startContent={<MdCarCrash />}
          >
            Confirmar vehículo
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
                    <UserInfoForm
                      initialValues={user ? user : ({} as UserModel)}
                      onSubmit={(values) => {
                        setUser(values);
                        setRegisterStage(PageStage.VEHICLE);
                      }}
                    >
                      <div className="w-full flex justify-end">
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
                  </div>
                ) : registerStage === PageStage.VEHICLE ? (
                  <div className="w-full flex flex-col gap-3">
                    <div>
                      <span className="font-inter font-bold text-2xl">
                        Formulario de registro de vehículo
                      </span>
                      <div className="hidden md:block md:w-1/6 bg-blue-600 h-1"></div>
                    </div>
                    <VehicleInfoForm
                      initialValues={vehicle ? vehicle : ({} as VehicleModel)}
                      onSubmit={(values) => {
                        setVehicle(values);
                        setRegisterStage(PageStage.CONFIRM_USER_INFO);
                      }}
                    >
                      <div className="w-full flex justify-end gap-2">
                        <div className="w-auto">
                          <ButtonComponent
                            color="primary"
                            text="Regresar"
                            type="button"
                            variant="light"
                            onClick={() => setRegisterStage(PageStage.USER)}
                          />
                        </div>
                        <div className="w-auto">
                          <ButtonComponent
                            color="primary"
                            text="Siguiente"
                            type="submit"
                            variant="solid"
                          />
                        </div>
                      </div>
                    </VehicleInfoForm>
                  </div>
                ) : registerStage === PageStage.CONFIRM_USER_INFO ? (
                  <div className="w-full">
                    {user ? (
                      <div className="w-full flex flex-col gap-5">
                        <UserInfo user={user} />
                        <div className="w-full flex justify-end gap-2">
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Regresar"
                              type="button"
                              variant="light"
                              onClick={() =>
                                setRegisterStage(PageStage.VEHICLE)
                              }
                            />
                          </div>
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Siguiente"
                              type="button"
                              variant="solid"
                              onClick={() =>
                                setRegisterStage(PageStage.CONFIRM_VEHICLE_INFO)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span>Debe llenar el formulario de usuario</span>
                    )}
                  </div>
                ) : registerStage === PageStage.CONFIRM_VEHICLE_INFO ? (
                  <div className="w-full">
                    {vehicle ? (
                      <div className="flex flex-col gap-5">
                        <VehicleInfo
                          dataCommingFrom="client"
                          vehicle={{
                            ...vehicle,
                            model: {
                              ...brandAndModel!.model!,
                              brand: brandAndModel!.brand!,
                            },
                          }}
                        />
                        <div className="w-full flex justify-end gap-2">
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Regresar"
                              type="button"
                              variant="light"
                              onClick={() =>
                                setRegisterStage(PageStage.CONFIRM_USER_INFO)
                              }
                              isDisabled={
                                isCreatingUser ||
                                isCreatingVehicle ||
                                isAttachingImages
                              }
                            />
                          </div>
                          <div className="w-auto">
                            <ButtonComponent
                              color="primary"
                              text="Continuar"
                              type="button"
                              variant="solid"
                              onClick={onOpen}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span>Debe llenar el formulario de vehículo</span>
                    )}
                  </div>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="mt-20"></div>
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
