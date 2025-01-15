import { useContext } from "react";
import { useUsersApiServices } from "../../../../../app/api/users";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import UserModel from "../../../model";
import { useFormik } from "formik";
import LogoComponent from "../../../../../components/logo/component";
import TextComponent from "../../../../../components/inputs/text";
import ButtonComponent from "../../../../../components/buttons/component";

type UpdateUsersNameComponentProps = {
  initialValues: { first_name: string; last_name: string };
  validationSchema: Object;
  user_id: number;
  token: string;
  label: string;
  action?: (values: UserModel) => void;
};

export function UpdateUsersNameComponent(props: UpdateUsersNameComponentProps) {
  const { isUpdatingUser, perform } = useUsersApiServices.updateGeneralUser();

  const { dispatch } = useContext(ToasterContext);

  async function onSubmit(values: { first_name: string; last_name: string }) {
    const response = await perform(props.user_id, values, props.token);
    if (response.status === StatusCodes.OK) {
      dispatch({
        payload: "Usuario actualizado correctamente",
        type: "SUCCESS",
      });
      if (props.action) props.action(response.data as UserModel);
    } else {
      dispatch({
        payload: (response.data as { errors: string[] }).errors
          ? (response.data as { errors: string[] }).errors[0]
          : "Usuario no pudo ser actualizado",
        type: "ERROR",
      });
    }
  }

  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit,
    validationSchema: props.validationSchema,
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <LogoComponent />
      <form
        className="my-5 text-center flex flex-col gap-3"
        onSubmit={formik.handleSubmit}
      >
        <TextComponent
          label="Nombre"
          name="first_name"
          type="text"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.errors.first_name}
          isError={formik.errors.first_name}
        />
        <TextComponent
          label="Apellido"
          name="last_name"
          type="text"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.errors.last_name}
          isError={formik.errors.last_name}
        />
        <div className="flex justify-center mt-5">
          <div className="w-auto">
            <ButtonComponent
              color="primary"
              text="Confirmar"
              type="submit"
              variant="solid"
              isLoading={isUpdatingUser}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
