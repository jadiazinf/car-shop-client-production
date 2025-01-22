import {
  Card,
  CardBody,
  Input,
  Radio,
  RadioGroup,
  Spinner,
} from "@nextui-org/react";
import UserModel from "../../../../../../../entities/user/model";
import { useEffect, useState } from "react";
import { useUsersApiServices } from "../../../../../../api/users";
import { usePersistedStore } from "../../../../../../../store/store";
import ButtonComponent from "../../../../../../../components/buttons/component";

type Props = {
  onAction?: (user: UserModel) => void;
  selectedUser: UserModel | null;
  setSelectedUser: (user: UserModel | null) => void;
};

export function SearchUserForQuoteComponent(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const [searchOption, setSearchOption] = useState<"email" | "dni" | "name">(
    "email"
  );

  const [inputValue, setInputValue] = useState("");

  const { perform, isFilteringUsers, usersFilteredResponse } =
    useUsersApiServices.getUsersByFilters();

  useEffect(() => {
    setInputValue("");
  }, [searchOption]);

  useEffect(() => {
    if (inputValue && inputValue.length > 2) {
      if (searchOption === "email") {
        perform({ email: inputValue }, token!);
      }
      if (searchOption === "name") {
        perform({ name: inputValue }, token!);
      }
      if (searchOption === "dni") {
        perform({ dni: inputValue }, token!);
      }
    }
  }, [inputValue]);

  function isUserSelected(user: UserModel) {
    return props.selectedUser?.id === user.id;
  }

  function handleAction() {
    if (props.onAction) props.onAction(props.selectedUser!);
  }

  return (
    <div className="w-full">
      <p className="font-semibold text-2xl font-inter mb-5">
        Buscar usuario para cotización
      </p>
      <RadioGroup
        label="Búsqueda"
        value={searchOption}
        onValueChange={(value) =>
          setSearchOption(value as "email" | "dni" | "name")
        }
        orientation="horizontal"
      >
        <Radio value="email">Por correo</Radio>
        <Radio value="dni">Por cédula de identidad</Radio>
        <Radio value="name">Por nombre</Radio>
      </RadioGroup>
      <div className="mt-10">
        <Card radius="sm" className="p-5">
          <CardBody>
            <Input
              label={
                searchOption === "email"
                  ? "Correo electrónico"
                  : searchOption === "dni"
                  ? "Cédula de identidad"
                  : "Nombre de la persona"
              }
              radius="sm"
              variant="bordered"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="w-full mt-2">
              {!inputValue ||
              inputValue.length < 3 ? null : isFilteringUsers ? (
                <Spinner />
              ) : !usersFilteredResponse ||
                !usersFilteredResponse.data ? null : (
                <div className="w-full flex flex-col gap-2">
                  {usersFilteredResponse?.data.map((user) => (
                    <div
                      className={`rounded-md w-full cursor-pointer transition-all duration-300 ease-in-out ${
                        isUserSelected(user)
                          ? "border border-primary "
                          : "bg-gray-400 bg-opacity-20 hover:bg-white hover:bg-opacity-100"
                      }`}
                      key={user.id}
                    >
                      <div
                        className="w-full p-2 border border-gray-200 rounded-md flex flex-col"
                        onClick={() => props.setSelectedUser(user)}
                      >
                        <p className="font-semibold font-inter">{`${user.first_name} ${user.last_name}`}</p>
                        <p className="text-sm text-black text-opacity-50">{`${user.email}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full flex mt-3">
              <div className="flex items-center gap-5">
                <div className="w-auto">
                  <ButtonComponent
                    color="primary"
                    text="Siguiente"
                    type="button"
                    variant="solid"
                    isDisabled={!props.selectedUser}
                    onClick={handleAction}
                  />
                </div>
                <div className="flex flex-col text-sm text-black text-opacity-50 w-full">
                  <p>Persona seleccionada:</p>
                  <p>{`${
                    props.selectedUser
                      ? `${props.selectedUser.first_name} ${props.selectedUser.last_name}`
                      : "No se ha seleccionado a un usuario"
                  }`}</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
