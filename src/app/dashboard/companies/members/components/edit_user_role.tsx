import { useContext, useState } from "react";
import { UserCompanyModel } from "../../../../../entities/users_companies/model";
import ButtonComponent from "../../../../../components/buttons/component";
import { useUsersCompaniesApiServices } from "../../../../api/users_companies";
import { usePersistedStore } from "../../../../../store/store";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import { UserCompanyRole } from "../../../../../entities/users_companies/types";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import { UserCompanyHelpers } from "../../../../../entities/users_companies/helpers";

type Props = {
  user_company: UserCompanyModel;
  closeModal: () => void;
  onRefresh: () => void;
};

function CompanyMemberEditUserRole({
  user_company,
  closeModal,
  onRefresh,
}: Props) {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { dispatch } = useContext(ToasterContext);

  const [roleState, setRoleState] = useState<string[]>(user_company.roles);

  const { isUpdatingUserCompany, perform } =
    useUsersCompaniesApiServices.updateUserCompany();

  async function handleUpdate() {
    const response = await perform(
      { ...user_company, roles: roleState as UserCompanyRole[] },
      sessionType!.company_id!,
      token!
    );

    if (response.status !== StatusCodes.OK) {
      dispatch({
        payload:
          (response.data as string) || "Error al actualizar el rol del usuario",
        type: "ERROR",
      });
      closeModal();
      return;
    }

    dispatch({ payload: "Rol actualizado correctamente", type: "SUCCESS" });
    onRefresh();
    closeModal();
    return;
  }

  return (
    <div className="flex flex-col gap-3">
      <CheckboxGroup
        color="primary"
        radius="sm"
        label="Seleccione los roles del usuario"
        value={roleState}
        onValueChange={(value) => setRoleState(value as UserCompanyRole[])}
      >
        {UserCompanyHelpers.getCompanyRolesKeysValuesForSelect().map(
          (element) => (
            <Checkbox key={element.value} value={element.value}>
              {element.label}
            </Checkbox>
          )
        )}
      </CheckboxGroup>
      <div className="w-auto flex justify-center items-center mt-3">
        <div>
          <ButtonComponent
            text="Guardar cambios"
            variant="solid"
            isDisabled={
              user_company.roles.join(", ") === roleState.join(", ") ||
              isUpdatingUserCompany
            }
            onClick={handleUpdate}
            color="primary"
            type="button"
            isLoading={isUpdatingUserCompany}
          />
        </div>
      </div>
    </div>
  );
}

export default CompanyMemberEditUserRole;
