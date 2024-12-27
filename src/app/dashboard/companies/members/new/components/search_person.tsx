import { Suspense, useContext, useEffect, useState } from "react";
import UserModel from "../../../../../../entities/user/model";
import { Divider, Input, Spinner } from "@nextui-org/react";
import { usePersistedStore } from "../../../../../../store/store";
import { useUsersCompaniesApiServices } from "../../../../../api/users_companies";
import { ToasterContext } from "../../../../../../components/toaster/context/context";
import { useUsersApiServices } from "../../../../../api/users";
import { StatusCodes } from "http-status-codes";
import ButtonComponent from "../../../../../../components/buttons/component";
import { UserCompanyModel } from "../../../../../../entities/users_companies/model";

function AutocompleteLoader() {
  return (
    <div
      className={`w-full bg-white rounded-md border-black border-1 border-opacity-50 px-3 py-2 flex justify-center items-center`}
    >
      <Spinner />
    </div>
  );
}

function Autocomplete(props: {
  email: string;
  selectedPerson: UserModel | null;
  setSelectedPerson: React.Dispatch<UserModel | null>;
}) {
  const { dispatch } = useContext(ToasterContext);

  const { sessionType, token } = usePersistedStore().authReducer;

  const [reactivateUserState, setReactivateUserState] = useState<{
    flag: boolean;
    user: UserModel | null;
  }>({ flag: false, user: null });

  const {
    isValidating,
    perform: validateIfUserIsRegistered,
    isUserRegisteredOnCompanyResponse,
  } = useUsersCompaniesApiServices.isUserRegisteredOnCompany();

  const {
    isFilteringUsers,
    perform: getUsersByFilters,
    usersFilteredResponse,
  } = useUsersApiServices.getUsersByFilters();

  const { perform: toggleActive, isTogglingActive } =
    useUsersCompaniesApiServices.toggleActive();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error)
      dispatch({
        type: "ERROR",
        payload: error || "Error al buscar usuario, inténtelo más tarde",
      });
  }, [error]);

  useEffect(() => {
    if (props.email) getUsersByFilters({ email: props.email }, token!);
    setReactivateUserState({ flag: false, user: null });
  }, [props.email]);

  useEffect(() => {
    if (usersFilteredResponse) {
      if (usersFilteredResponse.status === StatusCodes.INTERNAL_SERVER_ERROR)
        setError("Error de servidor, inténtelo más tarde");
      if (
        [StatusCodes.BAD_REQUEST, StatusCodes.NOT_FOUND].includes(
          usersFilteredResponse.status
        )
      )
        setError("Error al buscar usuario, inténtelo más tarde");
    }
  }, [usersFilteredResponse]);

  async function handleUserCompanyValidation(
    user: UserModel,
    userCompany: UserCompanyModel
  ) {
    props.setSelectedPerson(null);

    if (userCompany.is_active)
      setReactivateUserState({ flag: false, user: null });
    else setReactivateUserState({ flag: true, user });
  }

  async function handleSelectUser(user: UserModel) {
    const response = await validateIfUserIsRegistered(
      user.email,
      sessionType!.company_id!,
      token!
    );

    if (response.status === StatusCodes.NOT_FOUND) {
      props.setSelectedPerson(user);
      setReactivateUserState({ flag: false, user: null });
    }

    if (response.status === StatusCodes.OK)
      handleUserCompanyValidation(
        user,
        response.data?.user_company as UserCompanyModel
      );
  }

  async function reactivateUser() {
    try {
      if (reactivateUserState.user === null) return;

      const response = await toggleActive(
        reactivateUserState.user.id!,
        sessionType!.company_id!,
        token!
      );

      if (response.status === StatusCodes.OK) {
        dispatch({
          type: "SUCCESS",
          payload: "Usuario reactivado exitosamente",
        });
      } else {
        dispatch({
          type: "ERROR",
          payload: response.data as string,
        });
      }
      setReactivateUserState({ flag: false, user: null });
    } catch (error) {
      console.error("Error reactivating user", error);
      dispatch({
        type: "ERROR",
        payload: "Error al reactivar usuario, inténtelo más tarde",
      });
    }
  }

  return (
    <div>
      <div
        className={`${
          !props.email ||
          !usersFilteredResponse ||
          !usersFilteredResponse.data ||
          usersFilteredResponse.data.length === 0
            ? "hidden"
            : "block"
        } w-full bg-white rounded-md border-black border-1 border-opacity-50 px-3 py-2 max-h-96 overflow-auto`}
      >
        {isFilteringUsers ? (
          <div className="w-full h-full flex justify-center items-center p-2"></div>
        ) : !usersFilteredResponse ||
          !usersFilteredResponse.data ? null : usersFilteredResponse.data
            .length === 0 ? (
          <p className="text-sm text-black text-opacity-50">
            No hay data que mostrar
          </p>
        ) : (
          usersFilteredResponse.data.map((user, index) => (
            <div
              key={index}
              className={`flex flex-col gap-2 hover:bg-gray-400 hover:bg-opacity-20 transition-all duration-300 ease-in-out cursor-pointer rounded-md p-1`}
              onClick={() => handleSelectUser(user)}
            >
              <Divider />
              <div className="flex flex-col gap-1">
                <p className="text-black font-bold font-inter">{`${user.first_name} ${user.last_name}`}</p>
                <p className="text-black text-sm text-opacity-70">{`${user.email}`}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="py-3 w-full flex justify-center items-center">
        {isValidating ? (
          <Spinner />
        ) : isUserRegisteredOnCompanyResponse &&
          isUserRegisteredOnCompanyResponse.data?.user_company ? (
          <div className="w-full flex flex-col ">
            <p className="text-red-500 text-sm">
              {`${isUserRegisteredOnCompanyResponse.data?.user_company.user?.first_name} ${isUserRegisteredOnCompanyResponse.data?.user_company.user?.last_name} ya se encuentra registrado en la compañía`}
            </p>
            {reactivateUserState.flag ? (
              <div className="mt-5 flex flex-col gap-2">
                <p className="text-sm">
                  <strong>{`${reactivateUserState.user?.first_name} ${reactivateUserState.user?.last_name} se encuentra desactivado para la companía `}</strong>
                  ¿deseas reactivarlo?
                </p>
                <div className="flex w-auto">
                  <div>
                    <ButtonComponent
                      color="primary"
                      variant="bordered"
                      onClick={reactivateUser}
                      type="button"
                      text="Reactivar usuario"
                      isDisabled={isTogglingActive}
                      isLoading={isTogglingActive}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type Props = {
  selectedPerson: UserModel | null;
  setSelectedPerson: React.Dispatch<UserModel | null>;
};

function SearchPerson(props: Props) {
  const [email, setEmail] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  return (
    <div className="w-full flex flex-col gap-1">
      <Input
        name="search"
        type="text"
        placeholder="Buscar por correo electrónico"
        value={email}
        onChange={handleChange}
        radius="sm"
        label="Correo electrónico"
        labelPlacement="outside"
        variant="bordered"
      />
      <Suspense fallback={<AutocompleteLoader />}>
        <Autocomplete
          email={email}
          selectedPerson={props.selectedPerson}
          setSelectedPerson={props.setSelectedPerson}
        />
      </Suspense>
    </div>
  );
}

export default SearchPerson;
