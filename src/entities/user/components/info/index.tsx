import { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import UserModel from "../../model";
import useGetLocationParents, {
  GetLocationParentsProps,
} from "../../../location/services/get_parents/use_get_parents";
import UserHelper from "../../helper";
import DatesHelpers from "../../../../helpers/dates/helper";
import { LocationType } from "../../../location/types";
import { FaRegEdit } from "react-icons/fa";
import { UpdateUsersNameComponent } from "./update/name";
import { usePersistedStore } from "../../../../store/store";
import {
  UserBirthdateSchema,
  UserGenderSchema,
  UserNamesSchema,
  UserPhoneNumberSchema,
} from "../forms/user/validation_schema";
import { useDispatch } from "react-redux";
import { SetAuthentication } from "../../../../store/auth/reducers";
import { UpdateUserDateFieldComponent } from "./update/date";
import { UpdateUserSelectFieldComponent } from "./update/select";
import { UpdateUserTextFieldComponent } from "./update/text";
import { UpdateLocation } from "../../../../components/update/location";
import { useUsersApiServices } from "../../../../app/api/users";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../../components/toaster/context/context";

function UserInfo(props: { user: UserModel; isUpdatable?: boolean }) {
  const { status, sessionType, token } = usePersistedStore().authReducer;

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const {
    isGettingLocationParentsLoading,
    payloadState: locations,
    performGetLocationParents,
  } = useGetLocationParents();

  const { isUpdatingUser, perform: updateUser } =
    useUsersApiServices.updateGeneralUser();

  const [updateElement, setUpdateElement] = useState<JSX.Element | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const reduxDispatch = useDispatch();

  useEffect(() => {
    if (props.user.location_id || props.user.location) {
      const location_id = props.user.location_id || props.user.location?.id;
      performGetLocationParents({ location_id: location_id! });
    }
  }, []);

  useEffect(() => {
    if (updateElement && !isOpen) onOpen();
  }, [updateElement]);

  const userHelper = new UserHelper(props.user);

  function onUpdate(values: UserModel) {
    setUpdateElement(null);
    reduxDispatch(
      SetAuthentication({
        status,
        sessionType: {
          user: values,
          company_id: sessionType?.company_id || null,
          roles: sessionType?.roles || null,
        },
        token: token!,
      })
    );
    onClose();
  }

  async function onUpdateLocation(values: {
    location_id: number;
    address: string;
  }) {
    const response = await updateUser(props.user.id!, values, token!);
    if (response.status === StatusCodes.OK) {
      toasterDispatch({
        payload: "Dirección de usuario actualizada correctamente",
        type: "SUCCESS",
      });
      onUpdate(response.data as UserModel);
      window.location.href = "/profile";
    } else {
      toasterDispatch({
        payload: (response.data as { errors: string[] }).errors
          ? (response.data as { errors: string[] }).errors[0]
          : "No se pudo actualizar la dirección del usuario",
        type: "ERROR",
      });
    }
  }

  return (
    <>
      <Modal
        radius="sm"
        className="p-5"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalBody>
          <ModalContent>{updateElement}</ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex flex-col gap-5">
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex flex-col gap-5">
              <div className="w-full flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
                <span className="w-full font-bold text-lg mb-3">
                  Información básica
                </span>
                <div className="w-full flex flex-col gap-10">
                  <div className="flex flex-col lg:flex-row w-full">
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Nombre completo</p>
                      <div className="w-full flex items-center gap-3">
                        <p className="font-medium">
                          {props.user.first_name} {props.user.last_name}
                        </p>
                        {props.isUpdatable && (
                          <FaRegEdit
                            className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                            onClick={() =>
                              setUpdateElement(
                                <UpdateUsersNameComponent
                                  initialValues={{
                                    first_name: props.user.first_name,
                                    last_name: props.user.last_name,
                                  }}
                                  label=""
                                  token={token!}
                                  user_id={sessionType!.user.id!}
                                  validationSchema={UserNamesSchema}
                                  action={onUpdate}
                                />
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Fecha de nacimiento</p>
                      <div className="w-full flex items-center gap-3">
                        <p className="font-medium">
                          {DatesHelpers.formatYYYYMMDDtoDDMMYYYY(
                            props.user.birthdate as string
                          )}
                        </p>
                        {props.isUpdatable && (
                          <FaRegEdit
                            className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                            onClick={() =>
                              setUpdateElement(
                                <UpdateUserDateFieldComponent
                                  initialValues={{
                                    birthdate: props.user.birthdate,
                                  }}
                                  label="Fecha de nacimiento"
                                  token={token!}
                                  user_id={sessionType!.user.id!}
                                  validationSchema={UserBirthdateSchema}
                                  action={onUpdate}
                                />
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row w-full">
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Género</p>
                      <div className="flex items-center gap-3">
                        <p className="font-medium">
                          {userHelper.translateUserGender()}
                        </p>
                        {props.isUpdatable && (
                          <FaRegEdit
                            className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                            onClick={() =>
                              setUpdateElement(
                                <UpdateUserSelectFieldComponent
                                  initialValues={{
                                    gender: props.user.gender,
                                  }}
                                  values={[
                                    { key: "Male", label: "Hombre" },
                                    { key: "Female", label: "Mujer" },
                                  ]}
                                  label="Género"
                                  token={token!}
                                  user_id={sessionType!.user.id!}
                                  validationSchema={UserGenderSchema}
                                  action={onUpdate}
                                />
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">
                        Cédula de indetindad{" "}
                      </p>
                      <p className="font-medium">{props.user.dni}</p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row w-full">
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Número de teléfono</p>
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{props.user.phone_number}</p>
                        {props.isUpdatable && (
                          <FaRegEdit
                            className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                            onClick={() =>
                              setUpdateElement(
                                <UpdateUserTextFieldComponent
                                  initialValues={{
                                    phone_number: props.user.phone_number,
                                  }}
                                  label="Número de teléfono"
                                  token={token!}
                                  user_id={sessionType!.user.id!}
                                  validationSchema={UserPhoneNumberSchema}
                                  action={onUpdate}
                                />
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="font-light text-sm">Correo electrónico</p>
                      <p className="font-medium">{props.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-bold text-lg">Dirección</span>
                  {props.isUpdatable && (
                    <FaRegEdit
                      className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease-in-out duration-200 cursor-pointer"
                      onClick={() =>
                        setUpdateElement(
                          <UpdateLocation
                            data={{
                              address: props.user.address,
                              location_id: props.user.location_id!,
                            }}
                            onUpdate={onUpdateLocation}
                            isLoading={isUpdatingUser}
                          />
                        )
                      }
                    />
                  )}
                </div>
                {locations === "not loaded" &&
                !isGettingLocationParentsLoading ? null : isGettingLocationParentsLoading ? (
                  <Spinner />
                ) : (
                  <div className="flex flex-col gap-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full">
                      <div className="flex flex-col w-full">
                        <p className="font-light text-sm">País</p>
                        <p className="font-medium">
                          {
                            (locations as GetLocationParentsProps).payload.find(
                              (location) =>
                                location.location_type === LocationType.COUNTRY
                            )?.name
                          }
                        </p>
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="font-light text-sm">Estado</p>
                        <p className="font-medium">
                          {
                            (locations as GetLocationParentsProps).payload.find(
                              (location) =>
                                location.location_type === LocationType.STATE
                            )?.name
                          }
                        </p>
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="font-light text-sm">Ciudad</p>
                        <p className="font-medium">
                          {
                            (locations as GetLocationParentsProps).payload.find(
                              (location) =>
                                location.location_type === LocationType.CITY
                            )?.name
                          }
                        </p>
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="font-light text-sm">Municipio</p>
                        <p className="font-medium">
                          {
                            (locations as GetLocationParentsProps).payload.find(
                              (location) =>
                                location.location_type === LocationType.TOWN
                            )?.name
                          }
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col w-full">
                        <p className="font-light text-sm">Dirección exacta</p>
                        <p className="font-medium">{props.user.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
