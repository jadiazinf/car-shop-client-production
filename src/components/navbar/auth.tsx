import { useLocation, useNavigate } from "react-router-dom";
import { AuthStatus } from "../../auth/types";
import ButtonComponent from "../buttons/component";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { UserCompanyRole } from "../../entities/users_companies/types";
import AdminNavbarOptions from "./admin";
import GeneralNavbarOptions from "./general";
import TechnicianNavbarOptions from "./technician";
import { usePersistedStore } from "../../store/store";
import SuperadminNavbarOptions from "./superadmin";
import NotAuthenticatedNavbarOptions from "./not_authenticated";
import useGetUserCompanies from "../../entities/user/services/companies/use_get_companies";
import { useDispatch } from "react-redux";
import { SetAuthentication } from "../../store/auth/reducers";
import { UserCompanyHelpers } from "../../entities/users_companies/helpers";
import SupervisorNavbarOptions from "./supervisor";

function NotAuthenticatedNavbarActions() {
  const navigate = useNavigate();

  return (
    <div>
      <ButtonComponent
        color="primary"
        text="Comenzar"
        type="button"
        variant="solid"
        onClick={() => navigate("/auth")}
      />
    </div>
  );
}

function AuthenticatedNavbarActions() {
  const { sessionType, token, status } = usePersistedStore().authReducer;

  const [state, setState] = useState<{
    value: { firstName: string; lastName: string } | null;
  }>({ value: null });

  const navigate = useNavigate();

  const [changeSessionFlag, setChangeSessionFlag] = useState<boolean>(false);

  const { payloadState, performGetUserCompanies } = useGetUserCompanies();

  const appDispatch = useDispatch();

  useEffect(() => {
    if (status === AuthStatus.AUTHENTICATED && token)
      performGetUserCompanies({ user_id: sessionType!.user.id!, token });
  }, []);

  useEffect(() => {
    if (payloadState !== "not loaded")
      if (payloadState.payload?.length > 1) setChangeSessionFlag(true);
  }, [payloadState]);

  useEffect(() => {
    if (!sessionType) {
      setState({ value: null });
      return;
    }

    if (sessionType && sessionType.user) {
      setState({
        value: {
          firstName: sessionType.user.first_name,
          lastName: sessionType.user.last_name,
        },
      });
      return;
    }
  }, [sessionType]);

  function changeSession() {
    appDispatch(
      SetAuthentication({
        status: AuthStatus.AUTHENTICATED,
        sessionType: { user: sessionType!.user, company_id: null, roles: [] },
        token,
      })
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name="Jason Hughes"
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem
          key="profile"
          className="h-14 gap-2 text-center"
          onClick={() => navigate("/profile")}
        >
          <p className="font-semibold">
            {state.value
              ? `${state.value.firstName} ${state.value.lastName} ${
                  status !== AuthStatus.AUTHENTICATED
                    ? ""
                    : sessionType?.roles !== null
                    ? `(${UserCompanyHelpers.translateUserCompanyRole(
                        UserCompanyHelpers.getRoleWithGreaterHierarchy(
                          sessionType?.roles!
                        )
                      )})`
                    : ""
                }`
              : ""}
          </p>
        </DropdownItem>
        {changeSessionFlag ? (
          <DropdownItem key="change-session" color="primary">
            <ButtonComponent
              color="primary"
              text="Cambiar de empresa"
              type="button"
              variant="light"
              onClick={changeSession}
            />
          </DropdownItem>
        ) : (
          <></>
        )}
        <DropdownItem key="logout" color="danger">
          <ButtonComponent
            color="primary"
            text="Cerrar sesión"
            type="button"
            variant="light"
            onClick={() => navigate("/auth/logout")}
          />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export type NavbarOptionsProps = {
  text: string;
  url: string;
};

function AuthNavbarSection(props: {
  authStatus: AuthStatus;
  roles: UserCompanyRole[] | null;
}): JSX.Element {
  const location = useLocation();

  const [Actions, setActions] = useState<JSX.Element>(
    <NotAuthenticatedNavbarActions />
  );

  const [Options, setOptions] = useState<NavbarOptionsProps[]>(
    NotAuthenticatedNavbarOptions()
  );

  useEffect(() => {
    if (props.authStatus === AuthStatus.AUTHENTICATED)
      setActions(<AuthenticatedNavbarActions />);
    else setActions(<NotAuthenticatedNavbarActions />);
  }, [props.authStatus]);

  useEffect(() => {
    if (props.roles === null || props.roles.length === 0) {
      setOptions(NotAuthenticatedNavbarOptions());
      return;
    }

    if (props.roles.includes(UserCompanyRole.ADMIN)) {
      setOptions(AdminNavbarOptions());
      return;
    }

    if (props.roles.includes(UserCompanyRole.GENERAL)) {
      setOptions(GeneralNavbarOptions());
      return;
    }

    if (props.roles.includes(UserCompanyRole.SUPERVISOR)) {
      setOptions(SupervisorNavbarOptions());
      return;
    }

    if (props.roles.includes(UserCompanyRole.TECHNICIAN)) {
      setOptions(TechnicianNavbarOptions());
      return;
    }

    if (props.roles.includes(UserCompanyRole.SUPERADMIN)) {
      setOptions(SuperadminNavbarOptions());
      return;
    }
  }, [props.roles]);

  return (
    <>
      <NavbarContent justify="center">
        {Options.map((element, index) => (
          <NavbarItem
            key={index.toString()}
            isActive={location.pathname.startsWith(element.url)}
          >
            <Link color="foreground" href={element.url}>
              {element.text}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">{Actions}</NavbarContent>
    </>
  );
}

export default AuthNavbarSection;
