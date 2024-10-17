import { useNavigate } from "react-router-dom";
import { AuthStatus } from "../../auth/types";
import ButtonComponent from "../buttons/component";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarContent } from '@nextui-org/react';
import { useEffect, useState } from "react";
import { UserCompanyRole } from "../../entities/users_companies/types";
import AdminNavbarOptions from "./admin";
import GeneralNavbarOptions from "./general";
import TechnicianNavbarOptions from "./technician";
import { usePersistedStore } from "../../store/store";

function NotAuthenticatedNavbarOptions() {
  return (
    <>
    </>
  );
}

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

  const { authReducer } = usePersistedStore();

  const sessionType = authReducer.sessionType

  const [state, setState] = useState<{value: {firstName: string, lastName: string} | null}>({value: null});

  const navigate = useNavigate();

  useEffect(() => {
    if (!authReducer.sessionType) {
      setState({value: null});
      return;
    }

    if (sessionType && authReducer.sessionType.user) {
      setState({value: {firstName: sessionType.user.first_name, lastName: sessionType.user.last_name}});
      return;
    }
  }, [authReducer.sessionType]);

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
          <DropdownItem key="profile" className="h-14 gap-2 text-center">
            <p className="font-semibold">{state.value ? `${state.value.firstName} ${state.value.lastName}` : ''}</p>
          </DropdownItem>
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

function AuthNavbarSection(props: {authStatus: AuthStatus, roles: UserCompanyRole[] | null}): JSX.Element {

  const [Actions, setActions] = useState<JSX.Element>(<NotAuthenticatedNavbarActions />);

  const [Options, setOptions] = useState<JSX.Element>(<NotAuthenticatedNavbarOptions />)

  useEffect(() => {
    if (props.authStatus === AuthStatus.AUTHENTICATED)
      setActions(<AuthenticatedNavbarActions />);
    else
      setActions(<NotAuthenticatedNavbarActions />)
  }, [props.authStatus]);

  useEffect(() => {
    if (props.roles === null || props.roles.length === 0) {
      setOptions(<NotAuthenticatedNavbarOptions />);
      return;
    }

    if (props.roles.includes(UserCompanyRole.ADMIN)) {
      setOptions(<AdminNavbarOptions />);
      return;
    }

    if (props.roles.includes(UserCompanyRole.GENERAL)) {
      setOptions(<GeneralNavbarOptions />);
      return;
    }

    if (props.roles.includes(UserCompanyRole.TECHNICIAN)) {
      setOptions(<TechnicianNavbarOptions />);
      return;
    }
  }, [props.roles]);

  return (
    <>
      <NavbarContent justify="center">
        { Options }
      </NavbarContent>
      <NavbarContent justify="end">
        { Actions }
      </NavbarContent>
    </>
  );
}

export default AuthNavbarSection;
