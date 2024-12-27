import { UserCompanyModel } from "../../../../../entities/users_companies/model";
import ButtonComponent from "../../../../../components/buttons/component";
import { usePersistedStore } from "../../../../../store/store";
import { useUsersCompaniesApiServices } from "../../../../api/users_companies";
import { useContext } from "react";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";

type Props = {
  user_company: UserCompanyModel;
  onRefresh: () => void;
  closeModal: () => void;
};

function CompanyMemberDeleteUser({
  user_company,
  closeModal,
  onRefresh,
}: Props) {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { dispatch } = useContext(ToasterContext);

  const { isTogglingActive, perform } =
    useUsersCompaniesApiServices.toggleActive();

  async function handleDelete() {
    const response = await perform(
      user_company.id!,
      sessionType!.company_id!,
      token!
    );

    if (response.status !== StatusCodes.OK) {
      dispatch({
        type: "ERROR",
        payload:
          (response.data as string) ||
          "Error eliminando usuario, intente de nuevo más tarde",
      });
      closeModal();
      return;
    }

    dispatch({
      type: "SUCCESS",
      payload: "Usuario eliminado correctamente",
    });
    onRefresh();
    closeModal();
    return;
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <p>¿Está seguro de eliminar el usuario?</p>
      <div className="mt-5">
        <ButtonComponent
          onClick={handleDelete}
          text="Eliminar"
          type="button"
          color="primary"
          variant="solid"
          isLoading={isTogglingActive}
          isDisabled={isTogglingActive}
        />
      </div>
    </div>
  );
}

export default CompanyMemberDeleteUser;
