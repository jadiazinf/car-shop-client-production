import { useContext } from "react";
import ButtonComponent from "../../../../components/buttons/component";
import LogoComponent from "../../../../components/logo/component";
import VehicleModel from "../../../../entities/vehicle/model";
import { useVehicleApiServices } from "../../../api/vehicles";
import { ToasterContext } from "../../../../components/toaster/context/context";
import { usePersistedStore } from "../../../../store/store";
import { StatusCodes } from "http-status-codes";

type Props = { vehicle: VehicleModel };

export function DeleteVehicleConfirmation(props: Props) {
  const { token } = usePersistedStore().authReducer;

  const { isToggelingActiveVehicle, perform } =
    useVehicleApiServices.toggleActiveVehicle();

  const { dispatch } = useContext(ToasterContext);

  async function handleDelete() {
    const response = await perform(props.vehicle.id!, token!);
    if (response.status === StatusCodes.OK) {
      dispatch({
        payload: "Vehículo fue eliminado correctamente",
        type: "SUCCESS",
      });
      window.location.href = "/profile/vehicles";
      return;
    } else {
      dispatch({ payload: "Vehículo no pudo ser eliminado", type: "ERROR" });
      return;
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div>
        <LogoComponent />
      </div>
      <div className="mt-5 text-center">
        <p>¿Está seguro de querer eliminar el vehículo?</p>
        <strong>{`${props.vehicle.model?.brand?.name || ""} ${
          props.vehicle?.model?.name || ""
        }`}</strong>
      </div>
      <div className="mt-5">
        <ButtonComponent
          color="primary"
          text="Confirmar"
          type="button"
          variant="solid"
          isLoading={isToggelingActiveVehicle}
          onClick={handleDelete}
        />
      </div>
    </div>
  );
}
