import { useContext, useState } from "react";
import CompanyMemberNewForm from "./new_member_form/form";
import SearchPerson from "./search_person";
import UserModel from "../../../../../../entities/user/model";
import ButtonComponent from "../../../../../../components/buttons/component";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { UserCompanyRole } from "../../../../../../entities/users_companies/types";
import { ToasterContext } from "../../../../../../components/toaster/context/context";
import { usePersistedStore } from "../../../../../../store/store";
import LogoComponent from "../../../../../../components/logo/component";
import { useAuthApiServices } from "../../../../../api/auth";
import { StatusCodes } from "http-status-codes";
import { useUsersCompaniesApiServices } from "../../../../../api/users_companies";

function OptionBoxComponent() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const [selectedOption, setSelectedOption] = useState<"new" | "search">("new");

  const [selectedRoles, setSelectedRoles] = useState<UserCompanyRole[]>([]);

  const [selectedPerson, setSelectedPerson] = useState<UserModel | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { dispatch } = useContext(ToasterContext);

  const { isRegisteringUserLoading, perform: performRegisterNewUser } =
    useAuthApiServices.registerUser();

  const { isCreatingUserCompany, perform } =
    useUsersCompaniesApiServices.createUserCompany();

  async function registerNewUser(
    newUser: UserModel
  ): Promise<[boolean, UserModel | string]> {
    try {
      const { data, status } = await performRegisterNewUser(newUser);
      if (status !== StatusCodes.OK) return [true, data.message[0]];
      else return [false, data.data];
    } catch (error) {
      const message =
        "Error al crear el nuevo usuario, por favor inténtelo más tarde";
      console.log(message, error);
      return [true, message];
    }
  }

  async function handleUserFlowForRegister() {
    if (selectedOption === "new") {
      const result = await registerNewUser({
        ...selectedPerson!,
        password: selectedPerson!.dni,
        password_confirmation: selectedPerson!.dni,
      });
      return result;
    } else {
      return [false, selectedPerson!];
    }
  }

  async function handleRegister() {
    try {
      const result = await handleUserFlowForRegister();

      const [error, data] = result;

      if (error) {
        dispatch({
          type: "ERROR",
          payload: data as string,
        });
        return;
      }

      const { status } = await perform(
        {
          company_id: sessionType!.company_id!,
          user_id: (data as UserModel).id!,
          roles: selectedRoles!,
          is_active: true,
        },
        token!
      );

      if (status !== StatusCodes.CREATED) {
        dispatch({
          type: "ERROR",
          payload: "Error al agregar el usuario al taller",
        });
      } else {
        dispatch({
          type: "SUCCESS",
          payload: "Usuario agregado al taller",
        });
      }
    } catch (error) {
      console.log("Error en handleRegister en option_box.tsx", error);
    } finally {
      onClose();
    }
  }

  function handleRegisterNewUser(user: UserModel) {
    setSelectedPerson(user);
    onOpen();
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="flex flex-col p-10"
        size="2xl"
      >
        <ModalBody>
          <ModalContent>
            <div className="w-full flex justify-center items-center mb-10">
              <LogoComponent size="lg" />
            </div>
            <div>
              <CheckboxGroup
                color="primary"
                radius="sm"
                label="Seleccione los roles del usuario"
                value={selectedRoles}
                onValueChange={(value) =>
                  setSelectedRoles(value as UserCompanyRole[])
                }
              >
                <Checkbox value={UserCompanyRole.ADMIN}>Administrador</Checkbox>
                <Checkbox value={UserCompanyRole.TECHNICIAN}>Técnico</Checkbox>
              </CheckboxGroup>
              <div className="w-full flex justify-center items-center mt-5">
                <div>
                  <ButtonComponent
                    color="primary"
                    text="Completar"
                    type="button"
                    variant="solid"
                    onClick={handleRegister}
                    isDisabled={selectedRoles.length === 0}
                    // isLoading={
                    //   isCreatingUserCompany || isRegisteringUserLoading
                    // }
                  />
                </div>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full flex flex-col bg-white rounded-sm shadow-extend-sm font-inter">
        <div className="w-full flex">
          <div
            className={`w-full flex text-center justify-center items-center px-5 py-4 text-sm ${
              selectedOption === "new"
                ? "bg-white text-black border-t-3 border-blue-700"
                : "bg-slate-300 bg-opacity-50 text-black text-opacity-50 cursor-pointer border-t-3 border-gray-600 border-opacity-50"
            }`}
            onClick={() => setSelectedOption("new")}
          >
            Registrar nuevo usuario
          </div>
          <div
            className={`w-full text-center flex justify-center items-center px-5 py-4 text-sm ${
              selectedOption === "search"
                ? "bg-white text-black border-t-3 border-blue-700"
                : "bg-slate-300 bg-opacity-50 text-black text-opacity-50 cursor-pointer border-t-3 border-gray-600 border-opacity-50"
            }`}
            onClick={() => setSelectedOption("search")}
          >
            Buscar usuario existente
          </div>
        </div>
        <div className="w-full p-5">
          {selectedOption === "new" ? (
            <div className="w-full flex flex-col">
              <p className="font-inter font-medium text-2xl">
                Formulario de nuevo miembro
              </p>
              <CompanyMemberNewForm onSubmit={handleRegisterNewUser}>
                <div className="w-full flex justify-center">
                  <div className="w-52">
                    <ButtonComponent
                      color="primary"
                      text="Agregar usuario a taller"
                      type="submit"
                      variant="solid"
                    />
                  </div>
                </div>
              </CompanyMemberNewForm>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full h-full">
              <SearchPerson
                selectedPerson={selectedPerson}
                setSelectedPerson={setSelectedPerson}
              />
              {selectedPerson && (
                <div className="w-full flex flex-col gap-5">
                  <p className="font-inter font-medium text-2xl">
                    Información del usuario seleccionado
                  </p>
                  <div className="flex flex-col">
                    <p>{`Nombre: ${selectedPerson.first_name} ${selectedPerson.last_name}`}</p>
                    <p>{`Correo: ${selectedPerson.email}`}</p>
                  </div>
                  <div className="w-full flex justify-center">
                    <div className="w-52">
                      <ButtonComponent
                        color="primary"
                        text="Agregar usuario a taller"
                        type="button"
                        variant="solid"
                        onClick={onOpen}
                        isDisabled={!selectedPerson}
                        isLoading={
                          isRegisteringUserLoading || isCreatingUserCompany
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OptionBoxComponent;
